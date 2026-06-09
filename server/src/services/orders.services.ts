import { ObjectId } from 'mongodb'
import database from './database.services'
import { OrderStatus } from '~/models/schemas/Order.schema'
import { PurchaseStatus } from '~/models/schemas/Purchase.schema'

class OrderServices {
  async getOrdersByUser(user_id: string, status?: number) {
    const matchCondition: any = { user_id: new ObjectId(user_id) }
    if (status !== undefined && status !== -1) {
      matchCondition.status = Number(status)
    }

    const orders = await database.orders
      .aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: process.env.DB_PURCHASES_COLLECTIONS || 'purchases',
            localField: '_id',
            foreignField: 'order_id',
            as: 'purchases'
          }
        },
        { $unwind: { path: '$purchases', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: process.env.DB_PRODUCTS_COLLECTIONS || 'products',
            localField: 'purchases.product_id',
            foreignField: '_id',
            as: 'purchases.product'
          }
        },
        { $unwind: { path: '$purchases.product', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            order: { $first: '$$ROOT' },
            purchases: { $push: '$purchases' }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$order', { purchases: '$purchases' }]
            }
          }
        },
        { $sort: { created_at: -1 } }
      ])
      .toArray()

    return orders
  }

  async getAllOrdersAdmin() {
    const orders = await database.orders
      .aggregate([
        {
          $lookup: {
            from: process.env.DB_USER_COLLECTIONS || 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: process.env.DB_PURCHASES_COLLECTIONS || 'purchases',
            localField: '_id',
            foreignField: 'order_id',
            as: 'purchases'
          }
        },
        { $unwind: { path: '$purchases', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: process.env.DB_PRODUCTS_COLLECTIONS || 'products',
            localField: 'purchases.product_id',
            foreignField: '_id',
            as: 'purchases.product'
          }
        },
        { $unwind: { path: '$purchases.product', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            order: { $first: '$$ROOT' },
            purchases: { $push: '$purchases' }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$order', { purchases: '$purchases' }]
            }
          }
        },
        { $sort: { created_at: -1 } }
      ])
      .toArray()
    return orders
  }

  async updateOrderStatusAdmin(order_id: string, status: number) {
    const orderIdObj = new ObjectId(order_id)
    
    const result = await database.orders.findOneAndUpdate(
      { _id: orderIdObj },
      { $set: { status, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    // Sync status to purchases
    await database.purchases.updateMany(
      { order_id: orderIdObj },
      { $set: { status, updated_at: new Date() } }
    )

    return result
  }

  async cancelOrder(order_id: string, user_id: string) {
    const orderIdObj = new ObjectId(order_id)
    const userIdObj = new ObjectId(user_id)

    const order = await database.orders.findOne({ 
      _id: orderIdObj, 
      user_id: userIdObj,
      status: { $in: [OrderStatus.PENDING, OrderStatus.PROCESSING] } 
    })

    if (!order) {
      throw new Error('Đơn hàng không tồn tại hoặc không thể hủy ở trạng thái hiện tại')
    }

    // Cập nhật trạng thái Order
    const result = await database.orders.findOneAndUpdate(
      { _id: orderIdObj },
      { $set: { status: OrderStatus.CANCELLED, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    // Cập nhật trạng thái Purchases
    await database.purchases.updateMany(
      { order_id: orderIdObj },
      { $set: { status: PurchaseStatus.CANCELLED, updated_at: new Date() } }
    )

    // Hoàn lại số lượng tồn kho
    const purchases = await database.purchases.find({ order_id: orderIdObj }).toArray()
    const updateProductPromises = purchases.map((purchase) => {
      return database.products.updateOne(
        { _id: purchase.product_id },
        {
          $inc: {
            quantity: purchase.buy_count,
            sold: -purchase.buy_count
          }
        }
      )
    })
    await Promise.all(updateProductPromises)

    return result
  }
}

const orderServices = new OrderServices()
export default orderServices
