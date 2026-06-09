import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const categoryValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: 'Tên danh mục không được để trống'
        },
        isString: {
          errorMessage: 'Tên danh mục phải là chuỗi'
        },
        trim: true
      },
      image: {
        optional: true,
        isString: {
          errorMessage: 'Hình ảnh phải là chuỗi (URL)'
        }
      }
    },
    ['body']
  )
)
