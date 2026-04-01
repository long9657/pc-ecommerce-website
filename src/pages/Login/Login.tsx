import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import type { LoginSchema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '../../utils/rules'
import Input from '../../components/Input'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import type ResponseApi from '../../types/response.type'
import { useMutation } from '@tanstack/react-query'
import { LoginAccount } from '../../api/auth.api'

type LoginFormData = LoginSchema

export default function Login() {
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
      onSuccess: (data) => console.log(data),
      onError: (error) => {
        console.log({ error })
        if (isAxiosUnprocessableEntityError<ResponseApi<LoginFormData>>(error)) {
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

  // const rules = getRules(getValues)
  // (data) => console.log(data)
  console.log('error', errors)

  return (
    <div className='bg-orange'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                type='email'
                name='email'
                placeholder='Email'
                className='mt-8'
                errorMessage={errors.email?.message}
                register={register}
              ></Input>

              <Input
                name='password'
                type='password'
                register={register}
                placeholder='Password'
                autocomplete='on'
                errorMessage={errors.password?.message}
                className='mt-3'
              ></Input>

              <div className='mt-3'>
                <button className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'>
                  Đăng nhập
                </button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='text-red-400 ml-1' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
