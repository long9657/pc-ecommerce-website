import { Router } from 'express'
import { createReviewController, getReviewsController } from '~/controllers/reviews.controllers'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/wrap'

const reviewsRouter = Router()

reviewsRouter.get('/:product_id', wrapRequestHandler(getReviewsController))
reviewsRouter.post('/:product_id', accessTokenValidator, wrapRequestHandler(createReviewController))

export default reviewsRouter
