import { ObjectId } from 'mongodb'

export interface ProductVariant {
  name: string
  price: number
  price_before_discount: number
  quantity: number
  image?: string
}

interface ProductType {
  _id?: ObjectId
  name: string
  slug?: string
  description?: string
  category_id: ObjectId
  image: string
  images?: string[]
  variants?: ProductVariant[]
  price: number
  price_before_discount: number
  quantity: number
  color?: string
  sold?: number
  view?: number
  rating?: number
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  name: string
  slug: string
  description: string
  category_id: ObjectId
  image: string
  images: string[]
  variants: ProductVariant[]
  price: number
  price_before_discount: number
  quantity: number
  color: string
  sold: number
  view: number
  rating: number
  created_at: Date
  updated_at: Date

  constructor(product: ProductType) {
    const date = new Date()
    this._id = product._id
    this.name = product.name
    this.slug = product.slug || product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    this.description = product.description || ''
    this.category_id = product.category_id
    this.image = product.image
    this.images = product.images || []
    this.variants = product.variants || []
    this.price = product.price
    this.price_before_discount = product.price_before_discount
    this.quantity = product.quantity
    this.color = product.color || 'black'
    this.sold = product.sold || 0
    this.view = product.view || 0
    this.rating = product.rating || 0
    this.created_at = product.created_at || date
    this.updated_at = product.updated_at || date
  }
}
