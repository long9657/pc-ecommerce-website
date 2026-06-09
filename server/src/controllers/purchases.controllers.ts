import { Request, Response } from 'express'
import purchaseServices from '~/services/purchases.services'

export const addToCartController = async (req: Request, res: Response) => {
  const user_id = req.decoded_authorization.user_id
  const result = await purchaseServices.addToCart(user_id, req.body)
  return res.json({
    message: 'Thêm vào giỏ hàng thành công',
    result
  })
}

export const getPurchasesController = async (req: Request, res: Response) => {
  const user_id = req.decoded_authorization.user_id
  const status = req.query.status || 0 // Mặc định lấy giỏ hàng
  const result = await purchaseServices.getPurchases(user_id, Number(status))
  return res.json({
    message: 'Lấy danh sách đơn hàng thành công',
    result
  })
}

export const updatePurchaseController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { buy_count } = req.body
  const result = await purchaseServices.updatePurchase(id, buy_count)
  return res.json({
    message: 'Cập nhật giỏ hàng thành công',
    result
  })
}

export const deletePurchasesController = async (req: Request, res: Response) => {
  const purchase_ids = req.body.purchase_ids
  const result = await purchaseServices.deletePurchases(purchase_ids)
  return res.json({
    message: result.message
  })
}

export const buyPurchasesController = async (req: Request, res: Response) => {
  const purchase_ids = req.body.purchase_ids
  const payload = {
    recipient_name: req.body.recipient_name,
    phone_number: req.body.phone_number,
    shipping_address: req.body.shipping_address
  }
  const user_id = req.decoded_authorization.user_id
  const result = await purchaseServices.buyPurchases(purchase_ids, payload, user_id)
  return res.json({
    message: 'Mua hàng thành công',
    result
  })
}
