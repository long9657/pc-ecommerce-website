import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const productValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: { errorMessage: 'Tên sản phẩm không được để trống' },
        isString: { errorMessage: 'Tên sản phẩm phải là chuỗi' }
      },
      category_id: {
        notEmpty: { errorMessage: 'Danh mục không được để trống' },
        isMongoId: { errorMessage: 'ID Danh mục không hợp lệ' }
      },
      price: {
        notEmpty: { errorMessage: 'Giá không được để trống' },
        isNumeric: { errorMessage: 'Giá phải là số' }
      },
      price_before_discount: {
        notEmpty: { errorMessage: 'Giá trước giảm không được để trống' },
        isNumeric: { errorMessage: 'Giá trước giảm phải là số' }
      },
      quantity: {
        notEmpty: { errorMessage: 'Số lượng không được để trống' },
        isNumeric: { errorMessage: 'Số lượng phải là số' }
      },
      image: {
        notEmpty: { errorMessage: 'Ảnh đại diện không được để trống' },
        isString: { errorMessage: 'Ảnh đại diện phải là chuỗi (URL)' }
      },
      images: {
        optional: true,
        isArray: { errorMessage: 'Danh sách ảnh phải là mảng' }
      },
      variants: {
        optional: true,
        isArray: { errorMessage: 'Biến thể (variants) phải là mảng' }
      }
    },
    ['body']
  )
)
