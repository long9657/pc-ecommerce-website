import { useState } from 'react'
import { Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { forgotPassword } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')

  const forgotPasswordMutation = useMutation({
    mutationFn: (body: { email: string }) => forgotPassword(body)
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      toast.error('Vui lòng nhập email')
      return
    }
    
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data.data.message || 'Vui lòng kiểm tra email của bạn để khôi phục mật khẩu')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<any>(error)) {
            const formError = error.response?.data?.errors
            if (formError?.email) {
              toast.error(formError.email.msg)
            }
          } else {
            toast.error('Gửi yêu cầu thất bại')
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
        <span className='font-medium text-dark'>Forgot Password</span>
      </nav>

      <h1 className='text-3xl font-light text-dark leading-tight mb-12'>
        Forgot Your Password
      </h1>

      <div className='max-w-2xl bg-slate-50 p-8 md:p-12 mx-auto'>
        <h2 className='text-xl font-bold text-dark mb-4'>Reset Password</h2>
        <p className='text-gray-500 text-sm mb-6'>Vui lòng nhập địa chỉ email của bạn. Chúng tôi sẽ gửi cho bạn một đường link để đặt lại mật khẩu.</p>

        <form onSubmit={onSubmit} noValidate>
          <div className='mb-8'>
            <label className='block text-xs font-bold text-dark mb-2'>Email *</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Your Email'
              className='w-full px-4 py-3 bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm'
            />
          </div>

          <div className='flex items-center gap-6'>
            <button
              type='submit'
              disabled={forgotPasswordMutation.isLoading}
              className='px-8 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer'
            >
              {forgotPasswordMutation.isLoading && (
                <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
              )}
              Gửi Link Khôi Phục
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
