import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Popover from '../../components/Popover'

const ADMIN_MENUS = [
  { path: '/admin', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { path: '/admin/orders', label: 'Orders', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
  { path: '/admin/products', label: 'Products', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { path: '/admin/categories', label: 'Categories', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
  { path: '/admin/users', label: 'Users', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> }
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('Admin')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      toast.error('Please login with an admin account!')
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
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className='flex h-screen bg-[#F5F7FF] font-sans text-dark overflow-hidden'>
      {/* Sidebar */}
      <aside className='w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-10'>
        {/* Logo */}
        <div className='h-16 flex items-center px-6 border-b border-gray-200'>
          <Link to='/' className='text-primary font-black text-2xl tracking-tight flex items-center gap-2'>
            <span className='bg-primary text-white w-8 h-8 rounded-sm flex items-center justify-center text-sm'>
              PC
            </span>
            Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto py-6 space-y-0.5'>
          {ADMIN_MENUS.map((menu) => {
            const isActive = location.pathname === menu.path || 
                             (menu.path !== '/admin' && location.pathname.startsWith(menu.path))
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`flex items-center gap-3 px-6 py-3 font-semibold text-sm transition-all duration-200 border-l-4 ${
                  isActive
                    ? 'border-primary bg-[#F5F7FF] text-primary'
                    : 'border-transparent text-gray-500 hover:bg-[#F5F7FF] hover:text-dark'
                }`}
              >
                <span className='flex items-center justify-center'>{menu.icon}</span>
                {menu.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className='p-4 border-t border-gray-200 text-xs font-semibold text-gray-400 text-center'>
          PCStore Admin © 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 flex flex-col min-w-0 bg-[#F5F7FF]'>
        {/* Top Header */}
        <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shrink-0'>

          {/* User Profile */}
          <div className='flex items-center gap-4'>
            <Popover
              renderPopover={
                <div className='bg-white border border-gray-200 shadow-sm w-48 py-2 font-sans rounded-md'>
                  <div className='px-4 py-2 border-b border-gray-100 mb-1'>
                    <div className='font-bold text-dark text-sm truncate'>{username}</div>
                    <div className='text-xs text-gray-500 font-medium'>Administrator</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors'
                  >
                    Logout
                  </button>
                </div>
              }
            >
              <div className='flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200'>
                <img 
                  src='https://i.pravatar.cc/150?u=admin' 
                  alt='Admin Avatar' 
                  className='w-9 h-9 object-cover border-2 border-white'
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
