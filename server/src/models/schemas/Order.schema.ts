import { ObjectId } from 'mongodb'

export enum OrderStatus {
  PENDING = 1, // Chờ xác nhận
  PROCESSING = 2, // Đang xử lý / Đóng gói
  SHIPPING = 3, // Đang giao
  DELIVERED = 4, // Đã giao
  CANCELLED = 5 // Đã hủy
}

export enum PaymentMethod {
  COD = 'COD',
  ONLINE = 'ONLINE'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

interface OrderType {
  _id?: ObjectId
  user_id: ObjectId
  total_price: number
  total_discount?: number
  shipping_fee?: number
  final_price: number
  status?: OrderStatus
  payment_method?: PaymentMethod
  payment_status?: PaymentStatus
  recipient_name: string
  phone_number: string
  shipping_address: string
  created_at?: Date
  updated_at?: Date
}

export default class Order {
  _id?: ObjectId
  user_id: ObjectId
  total_price: number
  total_discount: number
  shipping_fee: number
  final_price: number
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  recipient_name: string
  phone_number: string
  shipping_address: string
  created_at: Date
  updated_at: Date

  constructor(order: OrderType) {
    const date = new Date()
    this._id = order._id
    this.user_id = order.user_id
    this.total_price = order.total_price
    this.total_discount = order.total_discount || 0
    this.shipping_fee = order.shipping_fee || 0
    this.final_price = order.final_price
    this.status = order.status || OrderStatus.PENDING
    this.payment_method = order.payment_method || PaymentMethod.COD
    this.payment_status = order.payment_status || PaymentStatus.UNPAID
    this.recipient_name = order.recipient_name
    this.phone_number = order.phone_number
    this.shipping_address = order.shipping_address
    this.created_at = order.created_at || date
    this.updated_at = order.updated_at || date
  }
}
