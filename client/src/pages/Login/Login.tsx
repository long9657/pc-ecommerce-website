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
    setError,
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
      onSuccess: () => {
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
    <div className='max-w-7xl mx-auto px-4 py-8 font-sans animate-fade-in mb-12'>
      <nav className='flex items-center gap-1.5 text-xs text-dark opacity-70 mb-8'>
        <Link to='/' className='hover:text-primary transition'>Home</Link>
        <span className='opacity-50'>›</span>
        <span className='font-medium text-dark'>Login</span>
      </nav>

      <h1 className='text-3xl font-light text-dark leading-tight mb-12'>
        Customer Login
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
        {/* Left Column: Login */}
        <div className='bg-slate-50 p-8 md:p-12'>
          <h2 className='text-xl font-bold text-dark mb-4'>Registered Customers</h2>
          <p className='text-gray-500 text-sm mb-6'>If you have an account, sign in with your email address.</p>

          <form onSubmit={onSubmit} noValidate>
            <div className='mb-6'>
              <label className='block text-xs font-bold text-dark mb-2'>Email *</label>
              <Input
                type='email'
                name='email'
                placeholder='Your Email'
                register={register}
                errorMessage={errors.email?.message}
              />
            </div>

            <div className='mb-8'>
              <label className='block text-xs font-bold text-dark mb-2'>Password *</label>
              <Input
                type='password'
                name='password'
                placeholder='Your Password'
                register={register}
                errorMessage={errors.password?.message}
                autocomplete='on'
              />
            </div>

            <div className='flex items-center gap-6'>
              <button
                type='submit'
                disabled={LoginAccountMutation.isLoading}
                className='px-8 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer'
              >
                {LoginAccountMutation.isLoading && (
                  <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                )}
                Sign In
              </button>
              <Link to='/forgot-password' className='text-primary text-sm font-semibold hover:underline'>
                Forgot Your Password?
              </Link>
            </div>
          </form>
        </div>

        {/* Right Column: New Customer */}
        <div className='bg-slate-50 p-8 md:p-12'>
          <h2 className='text-xl font-bold text-dark mb-4'>New Customer?</h2>
          <p className='text-gray-500 text-sm mb-6'>Creating an account has many benefits:</p>

          <ul className='text-dark text-sm space-y-3 mb-10 pl-4 list-disc'>
            <li>Check out faster</li>
            <li>Keep more than one address</li>
            <li>Track orders and more</li>
          </ul>

          <button
            onClick={() => navigate('/register')}
            className='px-8 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors cursor-pointer'
          >
            Create An Account
          </button>
        </div>
      </div>
    </div>
  )
}
