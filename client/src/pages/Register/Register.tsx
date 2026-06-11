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
    <div className='max-w-7xl mx-auto px-4 py-8 font-sans animate-fade-in mb-12'>
      <nav className='flex items-center gap-1.5 text-xs text-dark opacity-70 mb-8'>
        <Link to='/' className='hover:text-primary transition'>Home</Link>
        <span className='opacity-50'>›</span>
        <span className='font-medium text-dark'>Create New Customer Account</span>
      </nav>

      <h1 className='text-3xl font-light text-dark leading-tight mb-12'>
        Create New Customer Account
      </h1>

      <div className='bg-slate-50 p-8 md:p-12 w-full'>
        <h2 className='text-xl font-bold text-dark mb-4'>Personal Information</h2>
        <p className='text-gray-500 text-sm mb-8'>Please enter your details to create an account.</p>

        <form onSubmit={onSubmit} noValidate className='max-w-2xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <label className='block text-xs font-bold text-dark mb-2'>Full Name *</label>
              <Input
                type='text'
                name='name'
                placeholder='Your Full Name'
                register={register}
                errorMessage={errors.name?.message}
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-dark mb-2'>Email *</label>
              <Input
                type='email'
                name='email'
                placeholder='Your Email'
                register={register}
                errorMessage={errors.email?.message}
              />
            </div>
          </div>

          <div className='mb-6'>
            <label className='block text-xs font-bold text-dark mb-2'>Date of Birth *</label>
            <Input
              type='date'
              name='date_of_birth'
              register={register}
              errorMessage={errors.date_of_birth?.message}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div>
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

            <div>
              <label className='block text-xs font-bold text-dark mb-2'>Confirm Password *</label>
              <Input
                type='password'
                name='confirm_password'
                placeholder='Confirm Password'
                register={register}
                errorMessage={errors.confirm_password?.message}
                autocomplete='on'
              />
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <button
              type='submit'
              disabled={registerAccountMutation.isLoading}
              className='px-8 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer'
            >
              {registerAccountMutation.isLoading && (
                <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
              )}
              Create Account
            </button>
            
            <Link to='/login' className='text-primary text-sm font-semibold hover:underline'>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
