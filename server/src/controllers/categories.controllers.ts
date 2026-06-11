import { Request, Response } from 'express'
import categoryServices from '~/services/categories.services'

export const createCategoryController = async (req: Request, res: Response) => {
  const result = await categoryServices.createCategory(req.body)
  return res.json({
    message: 'Tạo danh mục thành công',
    result
  })
}

export const getCategoriesController = async (req: Request, res: Response) => {
  const result = await categoryServices.getCategories()
  return res.json({
    message: 'Lấy danh sách danh mục thành công',
    result
  })
}

export const updateCategoryController = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await categoryServices.updateCategory(id, req.body)
  return res.json({
    message: 'Cập nhật danh mục thành công',
    result
  })
}

export const deleteCategoryController = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await categoryServices.deleteCategory(id)
  return res.json({
    message: result.message
  })
}
