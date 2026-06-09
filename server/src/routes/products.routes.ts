import { Router } from 'express'
import {
  createProductController,
  deleteProductController,
  getProductDetailController,
  getProductsController,
  updateProductController
} from '~/controllers/products.controllers'
import { productValidator } from '~/middlewares/products.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/user.middlewares'
import helpersMiddleware from '~/middlewares/helpers.middlewares'
import { wrapRequestHandler } from '~/utils/wrap'

const productsRouter = Router()

productsRouter.get('/', wrapRequestHandler(getProductsController))

productsRouter.get(
  '/:id',
  wrapRequestHandler(getProductDetailController)
)

productsRouter.post(
  '/',
  accessTokenValidator,
  isAdminValidator,
  productValidator,
  wrapRequestHandler(createProductController)
)

productsRouter.put(
  '/:id',
  accessTokenValidator,
  isAdminValidator,
  productValidator,
  wrapRequestHandler(updateProductController)
)

productsRouter.delete(
  '/:id',
  accessTokenValidator,
  isAdminValidator,
  wrapRequestHandler(deleteProductController)
)

export default productsRouter
