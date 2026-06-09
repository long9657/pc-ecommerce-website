import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Popover from '../../components/Popover'

const ADMIN_MENUS = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/orders', label: 'Quản lý Đơn hàng', icon: '📦' },
  { path: '/admin/products', label: 'Quản lý Sản phẩm', icon: '💻' },
  { path: '/admin/users', label: 'Khách hàng', icon: '👥' }
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('Admin')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      toast.error('Vui lòng đăng nhập bằng tài khoản quản trị!')
      navigate('/login')
      return
    }
    const profileStr = localStorage.getItem('profile')
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr)
        setUsername(profile.name || profile.username || 'Admin')
        // if (!profile.roles?.includes(1)) { ... } 
        // Backend handles actual security, but we could check roles here too
      } catch (e) {
        // do nothing
      }
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('profile')
    window.dispatchEvent(new Event('clearLS'))
    toast.success('Đăng xuất thành công')
    navigate('/')
  }

  return (
    <div className='flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden'>
      {/* Sidebar */}
      <aside className='w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-10'>
        {/* Logo */}
        <div className='h-16 flex items-center px-6 border-b border-slate-100'>
          <Link to='/' className='text-blue-600 font-black text-2xl tracking-tight flex items-center gap-2'>
            <span className='bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm'>
              PC
            </span>
            Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto py-6 px-4 space-y-1.5'>
          {ADMIN_MENUS.map((menu) => {
            const isActive = location.pathname === menu.path || 
                             (menu.path !== '/admin' && location.pathname.startsWith(menu.path))
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className='text-lg'>{menu.icon}</span>
                {menu.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className='p-4 border-t border-slate-100 text-xs font-semibold text-slate-400 text-center'>
          PCStore Admin © 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 flex flex-col min-w-0 bg-slate-50'>
        {/* Top Header */}
        <header className='h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0'>
          {/* Search Bar (Placeholder) */}
          <div className='max-w-md w-full'>
            <div className='relative'>
              <input 
                type='text' 
                placeholder='Tìm kiếm nhanh...' 
                className='w-full bg-slate-100 text-sm font-medium text-slate-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all border border-transparent focus:border-blue-500/30'
              />
              <svg className='w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
          </div>

          {/* User Profile */}
          <div className='flex items-center gap-4'>
            <Popover
              renderPopover={
                <div className='bg-white border border-slate-200 rounded-xl shadow-lg w-48 py-2 font-sans'>
                  <div className='px-4 py-2 border-b border-slate-100 mb-1'>
                    <div className='font-bold text-slate-800 text-sm truncate'>{username}</div>
                    <div className='text-xs text-slate-500 font-medium'>Administrator</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors'
                  >
                    Đăng xuất
                  </button>
                </div>
              }
            >
              <div className='flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200'>
                <img 
                  src='https://i.pravatar.cc/150?u=admin' 
                  alt='Admin Avatar' 
                  className='w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm'
                />
              </div>
            </Popover>
          </div>
        </header>

        {/* Page Content */}
        <div className='flex-1 overflow-auto p-8'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
