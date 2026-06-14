import { Request, Response } from 'express'
import reviewServices from '~/services/reviews.services'

export const getReviewsController = async (req: Request, res: Response) => {
  const product_id = req.params.product_id as string
  const result = await reviewServices.getReviewsByProductId(product_id)
  return res.json({
    message: 'Lấy danh sách đánh giá thành công',
    result
  })
}

export const createReviewController = async (req: Request, res: Response) => {
  const product_id = req.params.product_id as string
  const { rating, text } = req.body
  const user_id = req.decoded_authorization?.user_id as string

  if (!user_id) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập' })
  }

  const ratingNum = Number(rating)
  if (!rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ message: 'Rating phải từ 1 đến 5' })
  }

  if (!text || !String(text).trim()) {
    return res.status(400).json({ message: 'Nội dung đánh giá là bắt buộc' })
  }


  const result = await reviewServices.createReview({
    product_id,
    user_id,
    rating: Number(rating),
    text
  })

  return res.json({
    message: 'Thêm đánh giá thành công',
    result
  })
}
