import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import database from '~/services/database.services'
import { validate } from '~/utils/validation'

export const addToCartValidator = validate(
  checkSchema(
    {
      product_id: {
        notEmpty: { errorMessage: 'ID sản phẩm không được để trống' },
        isMongoId: { errorMessage: 'ID sản phẩm không hợp lệ' },
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) throw new Error('ID Sản phẩm không hợp lệ')
            const product = await database.products.findOne({ _id: new ObjectId(value) })
            if (!product) {
              throw new Error('Sản phẩm không tồn tại')
            }
            return true
          }
        }
      },
      buy_count: {
        notEmpty: { errorMessage: 'Số lượng không được để trống' },
        isNumeric: { errorMessage: 'Số lượng phải là số' },
        custom: {
          options: (value) => {
            if (Number(value) < 1) {
              throw new Error('Số lượng mua phải lớn hơn 0')
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updatePurchaseValidator = validate(
  checkSchema(
    {
      buy_count: {
        notEmpty: { errorMessage: 'Số lượng không được để trống' },
        isNumeric: { errorMessage: 'Số lượng phải là số' },
        custom: {
          options: (value) => {
            if (Number(value) < 1) {
              throw new Error('Số lượng mua phải lớn hơn 0')
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const buyPurchasesValidator = validate(
  checkSchema(
    {
      purchase_ids: {
        notEmpty: { errorMessage: 'Danh sách ID đơn hàng không được để trống' },
        isArray: { errorMessage: 'Danh sách ID đơn hàng phải là mảng' },
        custom: {
          options: (value) => {
            for (const id of value) {
              if (!ObjectId.isValid(id)) {
                throw new Error('ID đơn hàng không hợp lệ')
              }
            }
            return true
          }
        }
      },
      recipient_name: {
        notEmpty: { errorMessage: 'Tên người nhận không được để trống' },
        isString: { errorMessage: 'Tên người nhận phải là chuỗi' },
        trim: true
      },
      phone_number: {
        notEmpty: { errorMessage: 'Số điện thoại không được để trống' },
        isString: { errorMessage: 'Số điện thoại phải là chuỗi' },
        trim: true
      },
      shipping_address: {
        notEmpty: { errorMessage: 'Địa chỉ giao hàng không được để trống' },
        isString: { errorMessage: 'Địa chỉ giao hàng phải là chuỗi' },
        trim: true
      }
    },
    ['body']
  )
)
