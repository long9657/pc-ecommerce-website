import { Link } from 'react-router'

function Header() {
  return (
    <header className='bg-white shadow-md'>
      

      <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
        <Link to='/'>
          <Link to='/' className='text-blue-600 font-bold text-2xl'>
            PCStore
          </Link>
        </Link>

        <nav className='hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700'>
          <Link to='/' className='hover:text-blue-600'>Laptops</Link>
          <Link to='/' className='hover:text-blue-600'>Desktop PCs</Link>
          <Link to='/' className='hover:text-blue-600'>Peripherals</Link>
          <Link to='/' className='hover:text-blue-600'>PC Parts</Link>
          <Link to='/' className='hover:text-blue-600'>All Other Products</Link>
          <Link
            to='/'
            className='border border-blue-600 text-blue-600 px-4 py-1 rounded-full hover:bg-blue-600 hover:text-white transition'
          >
            Our Deals
          </Link>
        </nav>

        <div className='flex items-center gap-4'>
          <button className='text-gray-600 hover:text-blue-600'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
              <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
            </svg>
          </button>

          <Link to='/' className='relative text-gray-600 hover:text-blue-600'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z' />
            </svg>
            <span className='absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>2</span>
          </Link>

          <Link to='/login'>
            <img
              src='https://i.pravatar.cc/32'
              alt='Avatar'
              className='w-8 h-8 rounded-full object-cover'
            />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header