import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { schema } from '../../utils/rules'
import type { Schema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from '../../components/Input'
import { useMutation } from '@tanstack/react-query'
import { RegisterAcount } from '../../api/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import type ResponseApi from '../../types/response.type'
type FormData = Schema
export default function Register() {
  const {
    setError,
    register,
    formState: { errors },
    handleSubmit
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => console.log(data),
      onError: (error) => {
        console.log({ error })
        if (isAxiosUnprocessableEntityError<ResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => RegisterAcount(body)
  })
  // const rules = getRules(getValues)
  // (data) => console.log(data)
  console.log('error', errors)

  return (
  <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
    <div className='bg-white rounded-lg shadow-md w-full max-w-md p-8'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Đăng ký</h2>

      <form onSubmit={onSubmit} noValidate>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
          <Input
            type='email'
            name='email'
            placeholder='Nhập email'
            register={register}
            errorMessage={errors.email?.message}
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Mật khẩu</label>
          <Input
            type='password'
            name='password'
            placeholder='Nhập mật khẩu'
            register={register}
            errorMessage={errors.password?.message}
            autocomplete='on'
          />
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Xác nhận mật khẩu</label>
          <Input
            type='password'
            name='confirm_password'
            placeholder='Nhập lại mật khẩu'
            register={register}
            errorMessage={errors.confirm_password?.message}
            autocomplete='on'
          />
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition'
        >
          Đăng ký
        </button>
      </form>

      <p className='text-center text-sm text-gray-500 mt-6'>
        Đã có tài khoản?{' '}
        <Link to='/login' className='text-blue-600 font-medium hover:underline'>
          Đăng nhập
        </Link>
      </p>
    </div>
  </div>
)
}
