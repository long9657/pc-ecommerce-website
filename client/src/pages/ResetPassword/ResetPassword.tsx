import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const resetPasswordMutation = useMutation({
    mutationFn: (body: { forgot_password_token: string; password: string; confirm_password: string }) => resetPassword(body)
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ mật khẩu')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp')
      return
    }
    if (!token) {
      toast.error('Token không hợp lệ hoặc đã hết hạn')
      return
    }
    
    resetPasswordMutation.mutate(
      { forgot_password_token: token, password, confirm_password: confirmPassword },
      {
        onSuccess: (data) => {
          toast.success(data.data.message || 'Mật khẩu đã được đặt lại thành công')
          navigate('/login')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<any>(error)) {
            const formError = error.response?.data?.errors
            if (formError?.password) toast.error(formError.password.msg)
            else if (formError?.confirm_password) toast.error(formError.confirm_password.msg)
            else if (formError?.forgot_password_token) toast.error(formError.forgot_password_token.msg)
          } else {
            const msg = (error as any)?.response?.data?.message
            toast.error(msg || 'Lỗi đặt lại mật khẩu')
          }
        }
      }
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 font-sans animate-fade-in mb-12'>
      <nav className='flex items-center gap-1.5 text-xs text-dark opacity-70 mb-8'>
        <Link to='/' className='hover:text-primary transition'>Home</Link>
        <span className='opacity-50'>›</span>
        <span className='font-medium text-dark'>Reset Password</span>
      </nav>

      <h1 className='text-3xl font-light text-dark leading-tight mb-12'>
        Reset Your Password
      </h1>

      <div className='max-w-2xl bg-slate-50 p-8 md:p-12 mx-auto'>
        <h2 className='text-xl font-bold text-dark mb-4'>Create New Password</h2>
        <p className='text-gray-500 text-sm mb-6'>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

        <form onSubmit={onSubmit} noValidate>
          <div className='mb-6'>
            <label className='block text-xs font-bold text-dark mb-2'>Mật khẩu mới *</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Nhập mật khẩu mới'
              className='w-full px-4 py-3 bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm'
            />
          </div>

          <div className='mb-8'>
            <label className='block text-xs font-bold text-dark mb-2'>Xác nhận mật khẩu mới *</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Nhập lại mật khẩu mới'
              className='w-full px-4 py-3 bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm'
            />
          </div>

          <div className='flex items-center gap-6'>
            <button
              type='submit'
              disabled={resetPasswordMutation.isLoading}
              className='px-8 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer'
            >
              {resetPasswordMutation.isLoading && (
                <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
              )}
              Lưu Mật Khẩu
            </button>
            <Link to='/login' className='text-primary text-sm font-semibold hover:underline'>
              Quay lại Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
