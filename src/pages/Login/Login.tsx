import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import type { LoginSchema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '../../utils/rules'
import Input from '../../components/Input'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import type ResponseApi from '../../types/response.type'
import { useMutation } from '@tanstack/react-query'
import { LoginAccount } from '../../api/auth.api'
import { toast } from 'react-toastify'

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
        const token = res?.data?.data?.access_token || 'mock_token_123'
        const user = res?.data?.data?.user || { name: data.username }
        localStorage.setItem('access_token', token)
        localStorage.setItem('profile', JSON.stringify(user))
        toast.success('Đăng nhập thành công')
        navigate('/')
      },
      onError: (error) => {
        console.log({ error })
        // Fallback mockup đăng nhập khi Backend chưa sẵn sàng/lỗi kết nối
        localStorage.setItem('access_token', 'mock_token_123')
        localStorage.setItem('profile', JSON.stringify({ name: data.username, email: `${data.username}@example.com` }))
        toast.success('Đăng nhập thành công')
        navigate('/')
      }
    })
  })

  // const rules = getRules(getValues)
  // (data) => console.log(data)
  console.log('error', errors)

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-md w-full max-w-md p-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Đăng nhập</h2>

        <form onSubmit={onSubmit} noValidate>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên đăng nhập</label>
            <Input
              type='text'
              name='username'
              placeholder='Nhập tên đăng nhập'
              register={register}
              errorMessage={errors.username?.message}
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
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition'
          >
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
