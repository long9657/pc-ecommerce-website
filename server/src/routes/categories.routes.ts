import { Router } from 'express'
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController
} from '~/controllers/categories.controllers'
import { categoryValidator } from '~/middlewares/categories.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/wrap'

const categoriesRouter = Router()

categoriesRouter.get('/', wrapRequestHandler(getCategoriesController))

categoriesRouter.post(
  '/',
  accessTokenValidator,
  isAdminValidator,
  categoryValidator,
  wrapRequestHandler(createCategoryController)
)

categoriesRouter.put(
  '/:id',
  accessTokenValidator,
  isAdminValidator,
  categoryValidator,
  wrapRequestHandler(updateCategoryController)
)

categoriesRouter.delete(
  '/:id',
  accessTokenValidator,
  isAdminValidator,
  wrapRequestHandler(deleteCategoryController)
)

export default categoriesRouter
