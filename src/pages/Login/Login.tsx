import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import type { LoginSchema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '../../utils/rules'
import Input from '../../components/Input'
import { useMutation } from '@tanstack/react-query'
import { LoginAccount } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'

type LoginFormData = LoginSchema

export default function Login() {
  const navigate = useNavigate()
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  })

  const LoginAccountMutation = useMutation({
    mutationFn: (body: LoginFormData) => LoginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = data
    LoginAccountMutation.mutate(body, {
      onSuccess: (res: any) => {
        toast.success('Đăng nhập thành công')
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<any>(error)) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof LoginFormData, {
                message: formError[key].msg,
                type: 'Server'
              })
            })
          }
        } else {
          toast.error('Đăng nhập thất bại, vui lòng thử lại!')
        }
      }
    })
  })

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-md w-full max-w-md p-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Đăng nhập</h2>

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

          <div className='mb-6'>
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

          <button
            type='submit'
            disabled={LoginAccountMutation.isLoading}
            className='w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {LoginAccountMutation.isLoading && (
              <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
            )}
            Đăng nhập
          </button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Chưa có tài khoản?{' '}
          <Link to='/register' className='text-blue-600 font-medium hover:underline'>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
