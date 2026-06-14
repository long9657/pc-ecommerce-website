import { ObjectId } from 'mongodb'
import Review from '~/models/schemas/Review.schema'
import database from './database.services'

class ReviewServices {
  async createReview(payload: { product_id: string; user_id: string; rating: number; text: string }) {
    const review = new Review({
      product_id: new ObjectId(payload.product_id),
      user_id: new ObjectId(payload.user_id),
      rating: payload.rating,
      text: payload.text
    })

    const result = await database.reviews.insertOne(review)

    // Update product rating and review count
    const productId = new ObjectId(payload.product_id)
    const allReviews = await database.reviews.find({ product_id: productId }).toArray()
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0)
    const newRating = Number((totalRating / allReviews.length).toFixed(1))

    await database.products.updateOne(
      { _id: productId },
      {
        $set: { rating: newRating },
      }
    )

    const newReview = await database.reviews.findOne({ _id: result.insertedId })
    const reviewWithUser = await database.reviews.aggregate([
      { $match: { _id: result.insertedId } },
      {
        $lookup: {
          from: process.env.DB_USER_COLLECTIONS || 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0,
          'user.forgot_password_token': 0,
          'user.verify_email_token': 0
        }
      }
    ]).toArray()

    return reviewWithUser[0] || newReview
  }

  async getReviewsByProductId(product_id: string) {
    const reviews = await database.reviews.aggregate([
      { $match: { product_id: new ObjectId(product_id) } },
      { $sort: { created_at: -1 } },
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
        $project: {
          'user.password': 0,
          'user.forgot_password_token': 0,
          'user.verify_email_token': 0
        }
      }
    ]).toArray()
    return reviews
  }
}

const reviewServices = new ReviewServices()
export default reviewServices
