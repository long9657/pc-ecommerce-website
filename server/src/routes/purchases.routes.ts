import { Router } from 'express'
import {
  addToCartController,
  buyPurchasesController,
  deletePurchasesController,
  getPurchasesController,
  updatePurchaseController
} from '~/controllers/purchases.controllers'
import {
  addToCartValidator,
  buyPurchasesValidator,
  updatePurchaseValidator
} from '~/middlewares/purchases.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/wrap'

const purchasesRouter = Router()

purchasesRouter.post(
  '/add-to-cart',
  accessTokenValidator,
  addToCartValidator,
  wrapRequestHandler(addToCartController)
)

purchasesRouter.get(
  '/',
  accessTokenValidator,
  wrapRequestHandler(getPurchasesController)
)

purchasesRouter.put(
  '/update-purchase/:id',
  accessTokenValidator,
  updatePurchaseValidator,
  wrapRequestHandler(updatePurchaseController)
)

purchasesRouter.post(
  '/buy',
  accessTokenValidator,
  buyPurchasesValidator,
  wrapRequestHandler(buyPurchasesController)
)

purchasesRouter.delete(
  '/',
  accessTokenValidator,
  wrapRequestHandler(deletePurchasesController)
)

export default purchasesRouter
