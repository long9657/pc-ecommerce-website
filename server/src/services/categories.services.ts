import { ObjectId } from 'mongodb'
import Category from '~/models/schemas/Category.schema'
import database from './database.services'
import { resolveProductImage } from '~/utils/image'

class CategoryServices {
  async createCategory(payload: { name: string; image: string }) {
    const result = await database.categories.insertOne(new Category(payload))
    const category = await database.categories.findOne({ _id: result.insertedId })
    return category
  }

  async getCategories() {
    const categories = await database.categories.find({}).toArray()
    return categories.map((cat) => ({
      ...cat,
      image: resolveProductImage({ name: cat.name, image: cat.image })
    }))
  }

  async updateCategory(id: string, payload: { name?: string; image?: string }) {
    const _id = new ObjectId(id)
    const result = await database.categories.findOneAndUpdate(
      { _id },
      { $set: { ...payload, updated_at: new Date() } },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteCategory(id: string) {
    const _id = new ObjectId(id)
    await database.categories.deleteOne({ _id })
    return { message: 'Xóa danh mục thành công' }
  }
}

const categoryServices = new CategoryServices()
export default categoryServices
