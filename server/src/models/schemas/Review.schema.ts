import { ObjectId } from 'mongodb'

interface ReviewType {
  _id?: ObjectId
  product_id: ObjectId
  user_id: ObjectId
  rating: number
  text: string
  created_at?: Date
  updated_at?: Date
}

export default class Review {
  _id?: ObjectId
  product_id: ObjectId
  user_id: ObjectId
  rating: number
  text: string
  created_at: Date
  updated_at: Date

  constructor(review: ReviewType) {
    this._id = review._id
    this.product_id = review.product_id
    this.user_id = review.user_id
    this.rating = review.rating
    this.text = review.text
    this.created_at = review.created_at || new Date()
    this.updated_at = review.updated_at || new Date()
  }
}
