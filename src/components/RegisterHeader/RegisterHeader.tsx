import { Link } from 'react-router'

export default function RegisterHeader() {
  return (
    <header className='bg-white shadow-sm py-4'>
      <div className='max-w-7xl mx-auto px-4 flex items-center justify-between'>
        <Link to='/' className='text-blue-600 font-bold text-2xl'>
          PCStore
        </Link>
        <div className='flex gap-4 text-sm'>
          <Link to='/login' className='text-gray-600 hover:text-blue-600'>Đăng nhập</Link>
          <Link to='/register' className='text-gray-600 hover:text-blue-600'>Đăng ký</Link>
        </div>
      </div>
    </header>
  )
}