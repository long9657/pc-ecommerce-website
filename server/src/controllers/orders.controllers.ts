import { Request, Response } from 'express'
import orderServices from '~/services/orders.services'

export const getOrdersController = async (req: Request, res: Response) => {
  const status = req.query.status as string
  const result = await orderServices.getOrdersByUser(req.decoded_authorization.user_id, Number(status))
  return res.json({
    message: 'Lấy danh sách đơn hàng thành công',
    result
  })
}

export const getAllOrdersAdminController = async (req: Request, res: Response) => {
  const result = await orderServices.getAllOrdersAdmin()
  return res.json({
    message: 'Lấy danh sách tất cả đơn hàng thành công',
    result
  })
}

export const updateOrderStatusAdminController = async (req: Request, res: Response) => {
  const result = await orderServices.updateOrderStatusAdmin(req.params.id as string, req.body.status)
  return res.json({
    message: 'Cập nhật trạng thái đơn hàng thành công',
    result
  })
}

export const cancelOrderController = async (req: Request, res: Response) => {
  const result = await orderServices.cancelOrder(req.params.id as string, req.decoded_authorization.user_id)
  return res.json({
    message: 'Hủy đơn hàng thành công',
    result
  })
}
