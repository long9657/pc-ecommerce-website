import { useEffect, useState } from 'react'
import { Link } from 'react-router'

interface UserProfile {
  name: string
  email: string
  phone?: string
  address?: string
}

export default function ProfileDashboard() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Driver',
    email: 'ExampeAdress@gmail.com',
    address: 'You have not set a default billing address.',
  })

  useEffect(() => {
    const profileStr = localStorage.getItem('profile')
    if (profileStr) {
      try {
        const data = JSON.parse(profileStr)
        setProfile({
          name: data.name || 'User',
          email: data.email || 'No email',
          phone: data.phone || 'No phone',
          address: data.address || 'You have not set a default billing address.'
        })
      } catch (e) {}
    }
  }, [])

  return (
    <div className='bg-transparent'>
      <h2 className='text-xl font-bold text-dark mb-6'>Account Information</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8 mb-12'>
        {/* Contact Information */}
        <div>
          <h3 className='text-sm font-bold text-dark mb-4 pb-2 border-b border-gray-200'>Contact Information</h3>
          <div className='text-[13px] text-gray-500 mb-4'>
            <p className='mb-1'>{profile.name}</p>
            <p>{profile.email}</p>
          </div>
          <div className='flex gap-4 text-[13px] text-primary'>
            <Link to='/profile/edit' className='hover:underline'>Edit</Link>
            <Link to='/profile/edit' className='hover:underline'>Change Password</Link>
          </div>
        </div>

        {/* Newsletters */}
        <div>
          <h3 className='text-sm font-bold text-dark mb-4 pb-2 border-b border-gray-200'>Newsletters</h3>
          <div className='text-[13px] text-gray-500 mb-4'>
            <p>You don't subscribe to our newsletter.</p>
          </div>
          <div className='flex gap-4 text-[13px] text-primary'>
            <Link to='/profile/newsletter' className='hover:underline'>Edit</Link>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-4 mb-6'>
        <h2 className='text-xl font-bold text-dark'>Address Book</h2>
        <Link to='/profile/address-book' className='text-[13px] text-primary hover:underline'>Manage Addresses</Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8'>
        {/* Default Billing Address */}
        <div>
          <h3 className='text-sm font-bold text-dark mb-4 pb-2 border-b border-gray-200'>Default Billing Address</h3>
          <div className='text-[13px] text-gray-500 mb-4'>
            <p className='mb-1'>{profile.address}</p>
          </div>
          <div className='flex gap-4 text-[13px] text-primary'>
            <Link to='/profile/edit' className='hover:underline'>Edit Address</Link>
          </div>
        </div>

        {/* Default Shipping Address */}
        <div>
          <h3 className='text-sm font-bold text-dark mb-4 pb-2 border-b border-gray-200'>Default Shipping Address</h3>
          <div className='text-[13px] text-gray-500 mb-4'>
            <p className='mb-1'>{profile.address}</p>
          </div>
          <div className='flex gap-4 text-[13px] text-primary'>
            <Link to='/profile/edit' className='hover:underline'>Edit Address</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
