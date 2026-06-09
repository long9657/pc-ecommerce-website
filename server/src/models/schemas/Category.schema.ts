import { ObjectId } from 'mongodb'

interface CategoryType {
  _id?: ObjectId
  name: string
  slug?: string
  image?: string
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  _id?: ObjectId
  name: string
  slug: string
  image: string
  created_at: Date
  updated_at: Date

  constructor(category: CategoryType) {
    const date = new Date()
    this._id = category._id
    this.name = category.name
    
    // Create a slug from name if not provided
    this.slug = category.slug || category.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    
    this.image = category.image || ''
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }
}
