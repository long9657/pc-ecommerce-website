import { Link, useNavigate, useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Popover from '../Popover'
import { useQuery } from '@tanstack/react-query'
import { getPurchases } from '../../api/purchase.api'
import { getCategories } from '../../api/category.api'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [searchValue, setSearchValue] = useState('')

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  })
  const categories = categoriesData?.data?.result || []

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsAuthenticated(!!token)
    if (token) {
      const profileStr = localStorage.getItem('profile')
      if (profileStr) {
        try {
          const profile = JSON.parse(profileStr)
          setUsername(profile.name || profile.username || 'User')
        } catch (e) {
          setUsername('User')
        }
      } else {
        setUsername('User')
      }
    }
  }, [location.pathname])

  const { data: cartData } = useQuery({
    queryKey: ['purchases', 0],
    queryFn: () => getPurchases({ status: 0 }),
    enabled: isAuthenticated
  })
  const cartItemsCount = cartData?.data?.result?.length || 0

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('profile')
    setIsAuthenticated(false)
    setUsername('')
    toast.success('Đăng xuất thành công')
    navigate('/')
  }
  const handleSearch = (e: any) => {
    if (e.key === 'Enter') navigate('/products?search=' + encodeURIComponent(searchValue))
  }
  return (
    <>
      <div className='bg-black text-white text-[11px] py-2 px-6 border-b border-white/10'>
        <div className='max-w-7xl mx-auto flex items-center justify-between font-sans'>

          <div className='flex items-center gap-1.5 opacity-90 select-none cursor-pointer hover:opacity-100 transition'>
            <span className='text-slate-400'>Mon-Thu:</span>
            <span className='font-bold text-white'>9:00 AM - 5:30 PM</span>
            <svg className='w-2.5 h-2.5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M19 9l-7 7-7-7' />
              <span className='text-slate-400'>Mon-Thu:</span>
              <span className='font-bold text-white'>9:00 AM - 5:30 PM</span>
            </svg>
          </div>

          <div className='hidden md:flex items-center gap-1.5 opacity-90 select-none'>
            <span className='text-slate-400'>Km 10 Nguyen Trai, Ha Noi</span>
            <Link to='/contact' className='underline hover:text-blue-400 font-bold transition text-white'>
              Contact Us
            </Link>
          </div>

        </div>
      </div>
      <header className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
            <Link to='/' className='text-blue-600 font-bold text-2xl'>
              PCStore
            </Link>

          <nav className='hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700 font-sans select-none'>
            {categories.slice(0, 4).map((cat: any) => (
              <Link key={cat._id} to={`/products?category=${cat._id}`} className='hover:text-blue-600 transition-colors uppercase text-xs font-bold'>
                {cat.name}
              </Link>
            ))}
            <Link to='/products' className='hover:text-blue-600 transition-colors text-xs font-bold uppercase'>Tất cả</Link>
            <Link
              to='/products'
              className='border border-blue-600 text-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 font-bold text-xs uppercase'
            >
              Khuyến Mãi
            </Link>
          </nav>

          {/* Tim kiem */}
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-1.5 text-xs border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 w-44 md:w-56 bg-slate-50 font-sans font-medium text-slate-700"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />


          {/* Cart */}
          <Link to='/bills' className='relative text-gray-600 hover:text-blue-600 transition-colors'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z' />
            </svg>
            {cartItemsCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm'>
                {cartItemsCount}
              </span>
            )}
          </Link>


          {/* Account */}
          {isAuthenticated ? (
            <Popover
              renderPopover={
                <div className='relative rounded-sm border border-gray-200 bg-white shadow-md w-40 overflow-hidden font-sans'>
                  <Link
                    to='/profile'
                    className='block w-full bg-white py-2.5 px-4 text-left text-sm text-gray-700 hover:bg-slate-50 hover:text-blue-600 transition'
                  >
                    My Account
                  </Link>
                  <Link
                    to='/bills'
                    className='block w-full bg-white py-2.5 px-4 text-left text-sm text-gray-700 hover:bg-slate-50 hover:text-blue-600 transition'
                  >
                    My Bills
                  </Link>
                  <button
                    className='block w-full bg-white py-2.5 px-4 text-left text-sm text-red-600 border-t border-gray-100 hover:bg-red-50 transition cursor-pointer font-medium'
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              }
            >
              <div className='flex items-center gap-2 cursor-pointer select-none'>
                <img
                  src='https://i.pravatar.cc/32'
                  alt='Avatar'
                  className='w-8 h-8 rounded-full object-cover border border-gray-200'
                />
                <span className='text-xs font-semibold text-gray-700 max-w-[80px] truncate hidden md:inline'>
                  {username}
                </span>
              </div>
            </Popover>
          ) : (
            <Popover
              renderPopover={
                <div className='relative rounded-sm border border-gray-200 bg-white shadow-md w-36 overflow-hidden font-sans'>
                  <button
                    className='block w-full bg-white py-2.5 px-4 text-left text-sm text-gray-700 hover:bg-slate-50 hover:text-blue-600 transition cursor-pointer font-medium'
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                  <button
                    className='block w-full bg-white py-2.5 px-4 text-left text-sm text-gray-700 border-t border-gray-100 hover:bg-slate-50 hover:text-blue-600 transition cursor-pointer font-medium'
                    onClick={() => navigate('/register')}
                  >
                    Sign In
                  </button>
                </div>
              }
            >
              <div className='flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-blue-600 transition duration-300 select-none'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                  />
                </svg>
                <span className='text-xs font-semibold hidden md:inline'>Sign In</span>
              </div>
            </Popover>
          )}
        </div>
      </header>
    </>
  );
}

export default Header
