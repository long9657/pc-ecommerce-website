import { Link, useNavigate, useLocation } from 'react-router'
import { generateNameId } from '../../utils/utils'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Popover from '../Popover'
import { useQuery } from '@tanstack/react-query'
import { getPurchases } from '../../api/purchase.api'
import { getCategories } from '../../api/category.api'
import http from '../../utils/http'


function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [, setUsername] = useState<string>('')
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
      // Tự động gọi API lấy profile mới nhất từ DB
      http.get('/users/me')
        .then((response) => {
          const user = response.data.result
          localStorage.setItem('profile', JSON.stringify(user))
          setUsername(user.name || user.username || 'User')
          setIsAdmin(user.roles?.includes(0) || user.roles?.includes('Admin'))
        })
        .catch(() => {
          // Nếu token đã bị xóa khỏi LS (do interceptor clear khi lỗi 401)
          const checkToken = localStorage.getItem('access_token')
          if (!checkToken) {
            setIsAuthenticated(false)
            setUsername('')
            setIsAdmin(false)
            return
          }

          // Fallback nếu API có lỗi
          const profileStr = localStorage.getItem('profile')
          if (profileStr) {
            try {
              const profile = JSON.parse(profileStr)
              setUsername(profile.name || profile.username || 'User')
              setIsAdmin(profile.roles?.includes(0) || profile.roles?.includes('Admin'))
            } catch (e) {
              setUsername('User')
              setIsAdmin(false)
            }
          } else {
            setUsername('User')
            setIsAdmin(false)
          }
        })
    } else {
      setIsAdmin(false)
      setUsername('')
    }

    const handleClearLS = () => {
      setIsAuthenticated(false)
      setUsername('')
    }
    window.addEventListener('clearLS', handleClearLS)
    
    return () => {
      window.removeEventListener('clearLS', handleClearLS)
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
    <header className='bg-white border-b border-gray-100'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between gap-6'>
        {/* Logo */}
        <Link to='/' className='flex-shrink-0'>
          <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <rect width='32' height='32' rx='16' fill='#0156FF' />
            <path d='M10 16L15 21L23 11' stroke='white' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </Link>

        {/* Navigation */}
        <nav className='hidden xl:flex items-center gap-6 text-[13px] font-semibold text-dark font-sans select-none whitespace-nowrap'>
          {categories.slice(0, 5).map((cat: any) => (
            <Link
              key={cat._id}
              to={`/products?category=${generateNameId({ name: cat.name, id: cat._id })}`}
              className='hover:text-primary transition-colors'
            >
              {cat.name}
            </Link>
          ))}
          <Link to='/products' className='hover:text-primary transition-colors'>
            All Other Products
          </Link>
          <Link to='/products' className='hover:text-primary transition-colors'>
            Repairs
          </Link>
          <Link
            to='/products'
            className='border-2 border-primary text-primary px-5 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-bold'
          >
            Our Deals
          </Link>
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-5 flex-shrink-0'>
          {/* Search */}
          <div className='relative group'>
            <input
              type='text'
              placeholder='Search...'
              className='w-8 h-8 opacity-0 group-hover:opacity-100 group-hover:w-48 absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full px-4 text-xs focus:outline-none transition-all duration-300 z-10'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button className='text-dark hover:text-primary transition-colors relative z-20 cursor-pointer w-8 h-8 flex items-center justify-end bg-white rounded-full group-hover:bg-transparent'>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
              </svg>
            </button>
          </div>

          {/* Cart */}
          <Popover
            renderPopover={
              <div className='relative bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-[320px] p-5 font-sans z-50 rounded-sm border border-gray-100'>
                {/* Triangle pointer */}
                <div className='absolute -top-1.5 right-4 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45'></div>
                
                <div className='relative bg-white z-10 text-center'>
                  <h3 className='text-lg font-bold text-dark'>My Cart</h3>
                  <p className='text-xs text-gray-400 mb-4'>{cartItemsCount} item in cart</p>
                  
                  <Link to='/bills' className='block w-full py-2 mb-4 border-2 border-primary text-primary rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-colors text-center'>
                    View or Edit Your Cart
                  </Link>

                  <div className='border-t border-b border-gray-100 py-4 mb-4 max-h-[300px] overflow-y-auto space-y-4 text-left'>
                    {cartData?.data?.result?.map((item: any) => (
                      <div key={item._id} className='flex gap-3 items-center group relative'>
                        <span className='text-sm font-bold text-dark shrink-0'>{item.buy_count} <span className='text-gray-400 font-normal'>x</span></span>
                        <img src={item.product?.image} alt={item.product?.name} className='w-12 h-12 object-contain shrink-0' />
                        <span className='text-xs font-semibold text-dark line-clamp-2 leading-snug'>{item.product?.name}</span>
                        
                        {/* Hover actions */}
                        <div className='absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-1 hidden group-hover:flex bg-white pl-2'>
                          <button className='w-5 h-5 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center hover:text-red-500 hover:border-red-500 transition-colors'>✕</button>
                          <button className='w-5 h-5 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center hover:text-primary hover:border-primary transition-colors'>✎</button>
                        </div>
                      </div>
                    ))}
                    {cartItemsCount === 0 && <p className='text-center text-gray-400 text-sm'>Cart is empty</p>}
                  </div>

                  <div className='flex justify-center gap-2 items-end mb-4'>
                    <span className='text-sm font-bold text-gray-400'>Subtotal:</span>
                    <span className='text-xl font-bold text-dark'>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                        cartData?.data?.result?.reduce((acc: number, item: any) => acc + (item.product?.price || 0) * item.buy_count, 0) || 0
                      )}
                    </span>
                  </div>

                  <Link to='/checkout' className='block w-full py-3 mb-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors text-center'>
                    Go to Checkout
                  </Link>
                  <button className='w-full py-3 bg-[#FFC439] text-[#003087] rounded-full text-sm font-bold hover:bg-[#F4B938] transition-colors flex items-center justify-center gap-1'>
                    Check out with <span className='font-black italic'>PayPal</span>
                  </button>
                </div>
              </div>
            }
          >
            <Link to='/bills' className='relative block text-dark hover:text-primary transition-colors py-2'>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z' />
              </svg>
              {cartItemsCount > 0 && (
                <span className='absolute top-0 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm pointer-events-none'>
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </Popover>

          {/* Account */}
          {isAuthenticated ? (
            <Popover
              renderPopover={
                <div className='relative bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-56 p-4 font-sans z-50 rounded-sm border border-gray-100'>
                  {/* Triangle pointer */}
                  <div className='absolute -top-1.5 right-4 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45'></div>
                  
                  <div className='relative bg-white z-10 flex flex-col gap-2.5 text-[13px] font-semibold text-gray-800'>
                    {isAdmin && (
                      <Link to='/admin' className='hover:text-primary transition-colors text-blue-600'>
                        🛡️ Admin Panel
                      </Link>
                    )}
                    <Link to='/profile' className='hover:text-primary transition-colors'>My Account</Link>
                    <Link to='/profile/orders' className='hover:text-primary transition-colors'>My Orders</Link>
                    <Link to='#' className='hover:text-primary transition-colors'>My Wish List (0)</Link>
                    <Link to='#' className='hover:text-primary transition-colors'>Compare (0)</Link>
                    <button onClick={handleLogout} className='text-left text-red-600 hover:text-red-500 transition-colors mt-1 cursor-pointer'>
                      Logout
                    </button>
                  </div>
                </div>
              }
            >
              <div className='flex items-center gap-2 cursor-pointer select-none'>
                <img
                  src='https://i.pravatar.cc/32'
                  alt='Avatar'
                  className='w-8 h-8 rounded-full object-cover border-2 border-primary/20 hover:border-primary transition-colors'
                />
              </div>
            </Popover>
          ) : (
            <Popover
              renderPopover={
                <div className='relative bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-56 p-4 font-sans z-50 rounded-sm border border-gray-100'>
                  {/* Triangle pointer */}
                  <div className='absolute -top-1.5 right-4 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45'></div>
                  
                  <div className='relative bg-white z-10 flex flex-col gap-2.5 text-[13px] font-semibold text-gray-800'>
                    <Link to='/login' className='hover:text-primary transition-colors'>Sign In</Link>
                    <Link to='/register' className='hover:text-primary transition-colors'>Create an Account</Link>
                  </div>
                </div>
              }
            >
              <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-dark hover:text-primary hover:bg-secondary transition-colors cursor-pointer'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z' />
                </svg>
              </div>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header
