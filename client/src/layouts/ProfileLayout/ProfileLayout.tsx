import { Outlet, NavLink, Link } from 'react-router'

export default function ProfileLayout() {
  return (
    <div className='bg-white min-h-screen pb-12 font-sans'>
      {/* Breadcrumb */}
      <div className='container mx-auto px-4 py-4 text-[13px] text-gray-500'>
        <Link to='/' className='hover:text-primary transition-colors'>Home</Link>
        <span className='mx-2'>›</span>
        <span className='text-dark font-semibold'>My Dashboard</span>
      </div>

      <div className='container mx-auto px-4'>
        <h1 className='text-[32px] font-bold text-dark mb-8'>My Dashboard</h1>
        
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Left Sidebar */}
          <div className='w-full md:w-[280px] flex-shrink-0'>
            <div className='bg-[#F5F7FF] rounded-lg pt-4 pb-2'>
              <h3 className='font-bold text-dark text-base px-5 mb-4 border-l-4 border-blue-600'>Account Dashboard</h3>
              <div className='flex flex-col text-[14px]'>
                <NavLink 
                  to='/profile/edit' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  Account Information
                </NavLink>
                <NavLink 
                  to='/profile/address-book' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  Address Book
                </NavLink>
                <NavLink 
                  to='/profile/orders' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  My Orders
                </NavLink>
                
                <div className='my-2 border-t border-gray-200 mx-5'></div>
                
                <NavLink 
                  to='/profile/downloads' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  My Downloadable Products
                </NavLink>
                <NavLink 
                  to='/profile/payments' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  Stored Payment Methods
                </NavLink>
                <NavLink 
                  to='/profile/billing-agreements' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  Billing Agreements
                </NavLink>
                <NavLink 
                  to='/profile/wishlist' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  My Wish List
                </NavLink>
                
                <div className='my-2 border-t border-gray-200 mx-5'></div>
                
                <NavLink 
                  to='/profile/reviews' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  My Product Reviews
                </NavLink>
                <NavLink 
                  to='/profile/newsletter' 
                  className={({isActive}) => `px-5 py-2 transition-colors ${isActive ? 'text-dark font-semibold' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
                >
                  Newsletter Subscriptions
                </NavLink>
              </div>
            </div>

            {/* Compare Products Panel */}
            <div className='bg-[#F5F7FF] rounded-lg mt-8 text-center'>
              <h3 className='font-bold text-dark text-base px-5 py-4'>Compare Products</h3>
              <p className='text-[13px] text-gray-500 px-5 pb-6'>You have no items to compare.</p>
            </div>

            {/* My Wish List Panel */}
            <div className='bg-[#F5F7FF] rounded-lg mt-4 text-center'>
              <h3 className='font-bold text-dark text-base px-5 py-4'>My Wish List</h3>
              <p className='text-[13px] text-gray-500 px-5 pb-6'>You have no items in your wish list.</p>
            </div>
          </div>

          {/* Right Content Area */}
          <div className='flex-1'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
