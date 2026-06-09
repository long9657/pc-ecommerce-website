import * as yup from 'yup'

export const schema = yup.object({
  name: yup.string().required('Họ và tên là bắt buộc'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .min(5, 'Email phải dài từ 5 - 150 ký tự')
    .max(150, 'Email phải dài từ 5 - 150 ký tự')
    .matches(/^\S+@\S+\.\S+$/, 'Email không đúng định dạng'),
  password: yup
    .string()
    .min(6, 'Password phải từ 6 - 50 ký tự')
    .max(50, 'Password phải từ 6 - 50 ký tự')
    .required('Password là bắt buộc'),
  confirm_password: yup
    .string()
    .min(6, 'Password phải từ 6 - 50 ký tự')
    .max(50, 'Password phải từ 6 - 50 ký tự')
    .required('Nhập lại password là bắt buộc')
    .oneOf([yup.ref('password')], 'Nhập lại password không đúng'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ').required('Ngày sinh là bắt buộc')
})

export const loginSchema = schema.omit(['name', 'confirm_password', 'date_of_birth'])
export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
