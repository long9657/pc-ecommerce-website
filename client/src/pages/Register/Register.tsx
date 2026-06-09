import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { schema } from '../../utils/rules'
import type { Schema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from '../../components/Input'
import { useMutation } from '@tanstack/react-query'
import { RegisterAcount } from '../../api/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { toast } from 'react-toastify'

type FormData = Schema
export default function Register() {
  const navigate = useNavigate()
  const {
    setError,
    register,
    formState: { errors },
    handleSubmit
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  
  const onSubmit = handleSubmit((data) => {
    const body = {
      ...data,
      date_of_birth: new Date(data.date_of_birth).toISOString()
    }
    
    registerAccountMutation.mutate(body, {
      onSuccess: () => {
        toast.success('Đăng ký tài khoản thành công')
        navigate('/login')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<any>(error)) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key].msg,
                type: 'Server'
              })
            })
          }
        } else {
          toast.error('Đăng ký thất bại, vui lòng thử lại!')
        }
      }
    })
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: any) => RegisterAcount(body)
  })

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12'>
      <div className='bg-white rounded-lg shadow-md w-full max-w-md p-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Đăng ký</h2>

        <form onSubmit={onSubmit} noValidate>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Họ và tên</label>
            <Input
              type='text'
              name='name'
              placeholder='Nhập họ và tên'
              register={register}
              errorMessage={errors.name?.message}
            />
          </div>

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
            <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày sinh</label>
            <Input
              type='date'
              name='date_of_birth'
              register={register}
              errorMessage={errors.date_of_birth?.message}
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
            disabled={registerAccountMutation.isLoading}
            className='w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {registerAccountMutation.isLoading && (
              <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
            )}
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
