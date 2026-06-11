import { ObjectId } from 'mongodb'

// status: 0 = in_cart, 1 = wait_for_confirmation, 2 = in_progress, 3 = delivered, 4 = cancelled
export enum PurchaseStatus {
  IN_CART = 0,
  WAIT_FOR_CONFIRMATION = 1,
  IN_PROGRESS = 2,
  DELIVERED = 3,
  CANCELLED = 4
}
interface PurchaseType {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  order_id?: ObjectId
  buy_count: number
  price?: number
  variant?: string
  status?: number
  created_at?: Date
  updated_at?: Date
}

export default class Purchase {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  order_id?: ObjectId
  buy_count: number
  price: number
  variant?: string
  status: number
  created_at: Date
  updated_at: Date

  constructor(purchase: PurchaseType) {
    const date = new Date()
    this._id = purchase._id
    this.user_id = purchase.user_id
    this.product_id = purchase.product_id
    this.order_id = purchase.order_id
    this.buy_count = purchase.buy_count
    this.price = purchase.price || 0
    this.variant = purchase.variant
    this.status = purchase.status || 0
    this.created_at = purchase.created_at || date
    this.updated_at = purchase.updated_at || date
  }
}
