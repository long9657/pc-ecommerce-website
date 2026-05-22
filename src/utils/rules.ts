
import * as yup from 'yup'

export const schema = yup.object({
  name: yup
    .string()
    .required('Ho va ten la bat buoc'),
  username: yup
    .string()
    .required('Username là bắt buộc'),
  address: yup
    .string()
    .required("Địa chỉ là bắt buộc"),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(
      /(0[3|5|7|8|9])+([0-9]{8})\b/,'Số điện thoại không đúng định dạng'
    ),
  email: yup
    .string()
    .required('Email la bat buoc')
    .min(5, 'Email phai dai tu 6 - 150 ky tu')
    .max(160, 'Email phai dai tu 6 - 150 ky tu')
    .matches(/^\S+@\S+\.\S+$/, 'Email không đúng định dạng'),
  password: yup
    .string()
    .min(5, 'Password phai dai tu 6 - 150 ky tu')
    .max(160, 'Password phai dai tu 6 - 150 ky tu')
    .required('Password la bat buoc'),
  confirm_password: yup
    .string()
    .min(5, 'Password phai dai tu 6 - 150 ky tu')
    .max(160, 'Password phai dai tu 6 - 150 ky tu')
    .required('Nhap lai password la bat buoc')
    .oneOf([yup.ref('password')], 'Nhap lai password khong dung')
})
export const loginSchema = schema.omit(['confirm_password', 'email', 'address', 'phone', 'name'])
export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
