import { Request, Response } from 'express'
import productServices from '~/services/products.services'

export const createProductController = async (req: Request, res: Response) => {
  const result = await productServices.createProduct(req.body)
  return res.json({
    message: 'Tạo sản phẩm thành công',
    result
  })
}

export const getProductsController = async (req: Request, res: Response) => {
  const result = await productServices.getProducts(req.query)
  return res.json({
    message: 'Lấy danh sách sản phẩm thành công',
    result
  })
}

export const getProductDetailController = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await productServices.getProductDetail(id)
  if (!result) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
  }
  return res.json({
    message: 'Lấy chi tiết sản phẩm thành công',
    result
  })
}

export const updateProductController = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await productServices.updateProduct(id, req.body)
  return res.json({
    message: 'Cập nhật sản phẩm thành công',
    result
  })
}

export const deleteProductController = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await productServices.deleteProduct(id)
  return res.json({
    message: result?.message || 'Xóa sản phẩm thành công'
  })
}
