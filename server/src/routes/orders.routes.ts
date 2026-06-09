import { Router } from 'express'
import {
  cancelOrderController,
  getAllOrdersAdminController,
  getOrdersController,
  updateOrderStatusAdminController
} from '~/controllers/orders.controllers'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/wrap'

const ordersRouter = Router()

// Lấy danh sách đơn hàng của User
ordersRouter.get('/', accessTokenValidator, wrapRequestHandler(getOrdersController))

// Lấy tất cả đơn hàng (Admin)
ordersRouter.get('/admin', accessTokenValidator, isAdminValidator, wrapRequestHandler(getAllOrdersAdminController))

// Hủy đơn hàng
ordersRouter.patch('/cancel/:id', accessTokenValidator, wrapRequestHandler(cancelOrderController))

// Cập nhật trạng thái đơn hàng (Admin)
ordersRouter.patch(
  '/update-status/:id',
  accessTokenValidator,
  isAdminValidator,
  wrapRequestHandler(updateOrderStatusAdminController)
)

export default ordersRouter
