import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    minLength: { value: 5, message: 'Email phai dai tu 6 - 150 ky tu' },
    maxLength: { value: 160, message: 'Email phai dai tu 6 - 150 ky tu' },
    required: { value: true, message: 'Email la bat buoc' }
  },
  password: {
    minLength: { value: 5, message: 'Password phai dai tu 6 - 150 ky tu' },
    maxLength: { value: 160, message: 'Password phai dai tu 6 - 150 ky tu' },
    required: { value: true, message: 'Password la bat buoc' }
  },
  confirm_password: {
    minLength: { value: 5, message: 'Password phai dai tu 6 - 150 ky tu' },
    maxLength: { value: 160, message: 'Password phai dai tu 6 - 150 ky tu' },
    required: { value: true, message: 'Nhap lai password la bat buoc' },
    validate:
      typeof getValues === 'function' ? (v) => v === getValues('password') || 'Nhap lai password khong dung' : undefined
  }
})
export const schema = yup.object({
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
export const loginSchema = schema.omit(['confirm_password'])
export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
