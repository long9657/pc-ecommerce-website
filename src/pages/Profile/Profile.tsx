import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'

interface UserProfile {
    name: string
    email: string
    phone?: string
    address?: string
}

export default function Profile() {
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    useEffect(() => {
        const profileStr = localStorage.getItem('profile')
        if (profileStr) {
            try {
                const data = JSON.parse(profileStr)
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '0123456789',
                    address: data.address || 'Km 10 Nguyễn Trãi, Hà Đông, Hà Nội'
                })
            }
            catch (e) {
                console.log(e);
            }
        }
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProfile((prev) => ({ ...prev, [name]: value }))
    }
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        localStorage.setItem('profile', JSON.stringify(profile))
        toast.success('Cap nhat thong tin thanh cong')
        window.dispatchEvent(new Event('storage'))
    }
    return (
    <div className='max-w-4xl mx-auto px-4 py-8 font-sans'>
      <div className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white'>
          <h2 className='text-2xl font-bold'>My Account</h2>
          <p className='text-blue-100 text-sm mt-1'>Quản lý và cập nhật thông tin cá nhân của bạn</p>
        </div>
        <form onSubmit={handleSave} className='p-8 space-y-6'>
          <div className='flex flex-col md:flex-row gap-8 items-start'>
            <div className='flex flex-col items-center gap-4 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8'>
              <div className='relative group'>
                <img
                  src='https://i.pravatar.cc/150'
                  alt='Avatar'
                  className='w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-lg'
                />
                <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer'>
                  <span className='text-xs text-white font-medium'>Đổi ảnh</span>
                </div>
              </div>
              <div className='text-center'>
                <h3 className='font-bold text-gray-800 text-lg'>{profile.name || 'Khách hàng'}</h3>
                <p className='text-xs text-gray-500 mt-0.5'>{profile.email || 'Chưa cập nhật email'}</p>
              </div>
            </div>
            <div className='flex-1 space-y-4 w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase mb-1'>Họ và tên</label>
                  <input
                    type='text'
                    name='name'
                    value={profile.name}
                    onChange={handleChange}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition'
                    required
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase mb-1'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={profile.email}
                    onChange={handleChange}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition'
                    required
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase mb-1'>Số điện thoại</label>
                  <input
                    type='text'
                    name='phone'
                    value={profile.phone}
                    onChange={handleChange}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase mb-1'>Hạng thành viên</label>
                  <input
                    type='text'
                    value='Gold Member VIP'
                    disabled
                    className='w-full border border-gray-100 bg-gray-50 text-gray-400 rounded-lg px-3 py-2 text-sm cursor-not-allowed font-medium'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase mb-1'>Địa chỉ nhận hàng</label>
                <textarea
                  name='address'
                  value={profile.address}
                  onChange={handleChange}
                  rows={3}
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition resize-none'
                />
              </div>
            </div>
          </div>
          <div className='border-t border-gray-100 pt-6 flex justify-end gap-3'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 transition cursor-pointer'
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}