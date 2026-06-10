import { ObjectId } from 'mongodb'
import Product from '~/models/schemas/Product.schema'
import database from './database.services'
import { normalizeProductImages } from '~/utils/image'

class ProductServices {
  async createProduct(payload: any) {
    const product = new Product({
      ...payload,
      category_id: new ObjectId(payload.category_id)
    })
    const result = await database.products.insertOne(product)
    return await database.products.findOne({ _id: result.insertedId })
  }

  async getProducts(query: any) {
    const { page = 1, limit = 20, category, search, sort, price_min, price_max } = query
    const match: any = {}
    
    if (category) {
      if (ObjectId.isValid(category)) {
        match.category_id = new ObjectId(category)
      } else {
        const cat = await database.categories.findOne({ slug: category })
        if (cat) {
          match.category_id = cat._id
        } else {
          match.category_id = new ObjectId() // Not found
        }
      }
    }
    if (search) {
      match.name = { $regex: search, $options: 'i' }
    }
    if (price_min || price_max) {
      match.price = {}
      if (price_min) match.price.$gte = Number(price_min)
      if (price_max) match.price.$lte = Number(price_max)
    }

    const sortOptions: any = {}
    if (sort === 'price_asc') sortOptions.price = 1
    else if (sort === 'price_desc') sortOptions.price = -1
    else if (sort === 'newest') sortOptions.created_at = -1
    else if (sort === 'top_sales') sortOptions.sold = -1
    else sortOptions.created_at = -1

    const skip = (Number(page) - 1) * Number(limit)

    const [products, total] = await Promise.all([
      database.products.find(match).sort(sortOptions).skip(skip).limit(Number(limit)).toArray(),
      database.products.countDocuments(match)
    ])

    return {
      products: products.map((p) => normalizeProductImages(p)),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        page_size: Math.ceil(total / Number(limit)),
        total_items: total
      }
    }
  }

  async getProductDetail(id: string) {
    let query: any = {}
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { slug: id }
    }
    const product = await database.products.findOneAndUpdate(
      query,
      { $inc: { view: 1 } },
      { returnDocument: 'after' }
    )
    return product ? normalizeProductImages(product) : product
  }

  async updateProduct(id: string, payload: any) {
    if (!ObjectId.isValid(id)) return null;
    const _id = new ObjectId(id)
    const updateData = { ...payload, updated_at: new Date() }
    if (updateData.category_id) {
      updateData.category_id = new ObjectId(updateData.category_id)
    }
    const product = await database.products.findOneAndUpdate(
      { _id },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return product
  }

  async deleteProduct(id: string) {
    if (!ObjectId.isValid(id)) return null;
    const _id = new ObjectId(id)
    await database.products.deleteOne({ _id })
    return { message: 'Xóa sản phẩm thành công' }
  }
}

const productServices = new ProductServices()
export default productServices
