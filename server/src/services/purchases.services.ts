import { ObjectId } from 'mongodb'
import Purchase from '~/models/schemas/Purchase.schema'
import Order, { OrderStatus, PaymentMethod, PaymentStatus } from '~/models/schemas/Order.schema'
import database from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

export enum PurchaseStatus {
  IN_CART = 0,
  WAIT_FOR_CONFIRMATION = 1,
  IN_PROGRESS = 2,
  DELIVERED = 3,
  CANCELLED = 4
}

class PurchaseServices {
  async addToCart(user_id: string, payload: { product_id: string; buy_count: number }) {
    const { product_id, buy_count } = payload

    const product = await database.products.findOne({ _id: new ObjectId(product_id) })
    if (!product) throw new ErrorWithStatus({ message: 'Sản phẩm không tồn tại', status: HTTP_STATUS.NOT_FOUND })

    const purchaseInDb = await database.purchases.findOne({
      user_id: new ObjectId(user_id),
      product_id: new ObjectId(product_id),
      status: PurchaseStatus.IN_CART
    })

    const total_buy_count = purchaseInDb ? purchaseInDb.buy_count + buy_count : buy_count
    if (total_buy_count > product.quantity) {
      throw new ErrorWithStatus({ 
        message: `Sản phẩm trong kho chỉ còn ${product.quantity} cái`, 
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY 
      })
    }

    if (purchaseInDb) {
      const result = await database.purchases.findOneAndUpdate(
        { _id: purchaseInDb._id },
        {
          $set: {
            buy_count: purchaseInDb.buy_count + buy_count,
            updated_at: new Date()
          }
        },
        { returnDocument: 'after' }
      )
      return result
    }

    const purchase = new Purchase({
      user_id: new ObjectId(user_id),
      product_id: new ObjectId(product_id),
      buy_count,
      status: PurchaseStatus.IN_CART
    })
    const result = await database.purchases.insertOne(purchase)
    return await database.purchases.findOne({ _id: result.insertedId })
  }

  async getPurchases(user_id: string, status: number) {
    const result = await database.purchases
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id),
            ...(Number(status) === -1 ? { status: { $gte: 1 } } : { status: Number(status) })
          }
        },
        {
          $lookup: {
            from: process.env.DB_PRODUCTS_COLLECTIONS || 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: '$product'
        }
      ])
      .toArray()
    return result
  }

  async updatePurchase(purchase_id: string, buy_count: number) {
    const purchase = await database.purchases.findOne({ _id: new ObjectId(purchase_id), status: PurchaseStatus.IN_CART })
    if (!purchase) throw new ErrorWithStatus({ message: 'Đơn hàng không tồn tại', status: HTTP_STATUS.NOT_FOUND })
    
    const product = await database.products.findOne({ _id: purchase.product_id })
    if (!product) throw new ErrorWithStatus({ message: 'Sản phẩm không tồn tại', status: HTTP_STATUS.NOT_FOUND })
    
    if (buy_count > product.quantity) {
      throw new ErrorWithStatus({ 
        message: `Sản phẩm trong kho chỉ còn ${product.quantity} cái`, 
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY 
      })
    }

    const result = await database.purchases.findOneAndUpdate(
      { _id: new ObjectId(purchase_id), status: PurchaseStatus.IN_CART },
      {
        $set: {
          buy_count,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result
  }

  async deletePurchases(purchase_ids: string[]) {
    const objectIds = purchase_ids.map((id) => new ObjectId(id))
    await database.purchases.deleteMany({ _id: { $in: objectIds }, status: PurchaseStatus.IN_CART })
    return { message: 'Xóa sản phẩm khỏi giỏ hàng thành công' }
  }

  async buyPurchases(purchase_ids: string[], payload: any, user_id: string) {
    const objectIds = purchase_ids.map((id) => new ObjectId(id))
    
    // 1. Lấy danh sách purchases và populate product để lấy giá hiện tại
    const purchases = await database.purchases.find({ _id: { $in: objectIds }, status: PurchaseStatus.IN_CART }).toArray()
    if (purchases.length === 0) throw new Error('Không tìm thấy sản phẩm trong giỏ hàng')

    const productIds = purchases.map(p => p.product_id)
    const products = await database.products.find({ _id: { $in: productIds } }).toArray()

    let total_price = 0
    
    const purchasesWithPrice = purchases.map(purchase => {
      const product = products.find(p => p._id?.toString() === purchase.product_id.toString())
      if (!product) throw new Error('Sản phẩm không tồn tại')
      if (product.quantity < purchase.buy_count) throw new Error(`Sản phẩm ${product.name} không đủ số lượng`)
      
      const price = product.price
      total_price += price * purchase.buy_count
      
      return {
        ...purchase,
        price
      }
    })

    // 2. Tạo Order
    const order = new Order({
      user_id: new ObjectId(user_id),
      total_price,
      final_price: total_price, // Chỗ này sau này trừ mã giảm giá, phí ship...
      status: OrderStatus.PENDING,
      payment_method: PaymentMethod.COD,
      payment_status: PaymentStatus.UNPAID,
      recipient_name: payload.recipient_name,
      phone_number: payload.phone_number,
      shipping_address: payload.shipping_address
    })
    const insertOrderResult = await database.orders.insertOne(order)
    const order_id = insertOrderResult.insertedId

    // 3. Cập nhật trạng thái purchases, gán order_id và price
    const updatePurchasePromises = purchasesWithPrice.map(purchase => {
      return database.purchases.updateOne(
        { _id: purchase._id },
        { 
          $set: { 
            status: PurchaseStatus.WAIT_FOR_CONFIRMATION, 
            order_id,
            price: purchase.price,
            updated_at: new Date() 
          },
          $unset: { recipient_name: "", phone_number: "", shipping_address: "" }
        }
      )
    })
    await Promise.all(updatePurchasePromises)

    // 4. Trừ số lượng tồn kho (quantity) và cộng số lượng đã bán (sold)
    const updateProductPromises = purchasesWithPrice.map((purchase) => {
      return database.products.updateOne(
        { _id: purchase.product_id },
        {
          $inc: {
            quantity: -purchase.buy_count,
            sold: purchase.buy_count
          }
        }
      )
    })
    await Promise.all(updateProductPromises)

    return { order_id, total_price, purchases: purchasesWithPrice }
  }

  async cancelPurchase(purchase_id: string, user_id: string) {
    const purchase = await database.purchases.findOne({ 
      _id: new ObjectId(purchase_id), 
      user_id: new ObjectId(user_id),
      status: { $in: [PurchaseStatus.WAIT_FOR_CONFIRMATION, PurchaseStatus.IN_PROGRESS] } 
    })

    if (!purchase) {
      throw new Error('Đơn hàng không tồn tại hoặc không thể hủy ở trạng thái hiện tại')
    }

    // Hủy đơn
    const result = await database.purchases.findOneAndUpdate(
      { _id: new ObjectId(purchase_id) },
      { $set: { status: PurchaseStatus.CANCELLED, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    // Hoàn lại số lượng tồn kho
    await database.products.updateOne(
      { _id: purchase.product_id },
      {
        $inc: {
          quantity: purchase.buy_count,
          sold: -purchase.buy_count
        }
      }
    )

    return result
  }

  async getAllPurchasesAdmin() {
    const result = await database.purchases
      .aggregate([
        {
          $match: {
            status: { $gte: PurchaseStatus.WAIT_FOR_CONFIRMATION }
          }
        },
        {
          $lookup: {
            from: process.env.DB_PRODUCTS_COLLECTIONS || 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $lookup: {
            from: process.env.DB_USER_COLLECTIONS || 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $sort: { updated_at: -1 } }
      ])
      .toArray()
    return result
  }

  async updatePurchaseStatusAdmin(purchase_id: string, status: number) {
    const result = await database.purchases.findOneAndUpdate(
      { _id: new ObjectId(purchase_id) },
      { $set: { status, updated_at: new Date() } },
      { returnDocument: 'after' }
    )
    return result
  }
}

const purchaseServices = new PurchaseServices()
export default purchaseServices
