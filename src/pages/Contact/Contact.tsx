import React from 'react'
// Import các icons cần thiết từ thư viện react-icons
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineClock, HiOutlineMail } from 'react-icons/hi'

const Contact: React.FC = () => {
  return (
    // 1. Container chính: Đảm bảo toàn màn hình, màu nền trắng, căn lề và padding
    <div className='min-h-screen bg-white text-gray-900 font-sans'>
      {/* 2. Phần Header (Breadcrumb & Title) */}
      <div className='container max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-16'>
        <nav className='text-sm text-gray-600 mb-6 flex items-center space-x-2'>
          <a href='#' className='hover:text-blue-600 transition'>
            Home
          </a>
          <span className='text-gray-400'>›</span>
          <span className='text-gray-900 font-medium'>Contact Us</span>
        </nav>

        <h1 className='text-4xl md:text-5xl font-extrabold text-black mb-6 tracking-tight'>Contact Us</h1>

        <div className='max-w-3xl text-gray-700 text-lg leading-relaxed space-y-2'>
          <p>We love hearing from you, our Shop customers.</p>
          <p>Please contact us and we will make sure to get back to you as soon as we possibly can.</p>
        </div>
      </div>

      {/* -------------------------------The form *-------------------------------------------------------------/}
      
      {/* 3. Bố cục chính Grid: 2 cột trên màn hình lớn, 1 cột trên điện thoại */}
      <div className='container flex-column grid-cols-12 mx-auto max-w-7xl px-6 pb-20 md:px-12 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-16 md:gap-24 items-start'>
        {/* --- CỘT TRÁI: BIỂU MẪU LIÊN HỆ --- */}
        <form className='space-y-10 col-span-7'>
          {/* Row 1: Name & Email */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-2.5'>
              <label htmlFor='name' className='block text-sm font-bold text-black flex items-center'>
                Your Name <span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                type='text'
                id='name'
                placeholder='Your Name'
                className='w-full px-5 py-4 border border-gray-200 rounded-lg outline-none transition duration-150 
                           focus:border-blue-300 focus:ring-2 focus:ring-blue-50 text-base placeholder:text-gray-400'
              />
            </div>

            <div className='space-y-2.5'>
              <label htmlFor='email' className='block text-sm font-bold text-black flex items-center'>
                Your Email <span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                type='email'
                id='email'
                placeholder='Your Name' // Placeholder y hệt ảnh gốc
                className='w-full px-5 py-4 border border-gray-200 rounded-lg outline-none transition duration-150 
                           focus:border-blue-300 focus:ring-2 focus:ring-blue-50 text-base placeholder:text-gray-400'
              />
            </div>
          </div>

          {/* Row 2: Phone Number */}
          <div className='space-y-2.5'>
            <label htmlFor='phone' className='block text-sm font-bold text-black'>
              Your Phone Number
            </label>
            <input
              type='tel'
              id='phone'
              placeholder='Your Phone'
              className='w-full px-5 py-4 border border-gray-200 rounded-lg outline-none transition duration-150 
                         focus:border-blue-300 focus:ring-2 focus:ring-blue-50 text-base placeholder:text-gray-400'
            />
          </div>

          {/* Row 3: Message Area */}
          <div className='space-y-2.5'>
            <label htmlFor='message' className='block text-sm font-bold text-black flex items-center'>
              What's on your mind? <span className='text-red-500 ml-1'>*</span>
            </label>
            <textarea
              id='message'
              rows={10}
              placeholder="Jot us a note and we'll get back to you as quickly as possible"
              className='w-full px-5 py-4 border border-gray-200 rounded-lg outline-none transition duration-150 
                         focus:border-blue-300 focus:ring-2 focus:ring-blue-50 text-base placeholder:text-gray-400 resize-y'
            ></textarea>
          </div>

          {/* Row 4: Submit Button */}
          <div className='pt-4'>
            <button
              type='submit'
              className=' -mt-8  px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full 
                         transition duration-200 shadow-lg shadow-blue-100 transform hover:-translate-y-0.5 active:translate-y-0'
            >
              Submit
            </button>
          </div>
        </form>
        {/* -----------------------------------------dia chi------------------------------------------------- */}

        <div className='bg-[#F8F9FE] p-10 md:p-12 rounded-2xl space-y-10 border border-gray-50 shadow-sm col-span-5 -mt-10'>
          {/* Item: Address */}
          <div className='flex items-start space-x-6'>
            <HiOutlineLocationMarker className='text-gray-900 mt-1 flex-shrink-0' size={32} strokeWidth={1.5} />
            <div className='space-y-1.5  '>
              <h3 className='text-xl font-bold text-black '>Address:</h3>
              <p className='text-gray-700 text-base leading-relaxed  text-center'>
                1234 Street Adress City Address, 1234
              </p>
            </div>
          </div>

          {/* Item: Phone */}
          <div className='flex items-start space-x-6'>
            <HiOutlinePhone className='text-gray-900 mt-1 flex-shrink-0' size={32} strokeWidth={1.5} />
            <div className='space-y-1.5'>
              <h3 className='text-xl font-bold text-black'>Phone:</h3>
              <p className='text-gray-700 text-base'>(00)1234 5678</p>
            </div>
          </div>

          {/* Item: We are open */}
          <div className='flex items-start space-x-6'>
            <HiOutlineClock className='text-gray-900 mt-1 flex-shrink-0' size={32} strokeWidth={1.5} />
            <div className='space-y-1.5'>
              <h3 className='text-xl font-bold text-black'>We are open:</h3>
              <p className='text-gray-700 text-base leading-relaxed'>
                Monday - Thursday: 9:00 AM - 5:30 PM
                <br />
                Friday 9:00 AM - 6:00 PM
                <br />
                Saturday: 11:00 AM - 5:00 PM
              </p>
            </div>
          </div>

          {/* Item: E-mail */}
          <div className='flex items-start space-x-6'>
            <HiOutlineMail className='text-gray-900 mt-1 flex-shrink-0' size={32} strokeWidth={1.5} />
            <div className='space-y-1.5'>
              <h3 className='text-xl font-bold text-black'>E-mail:</h3>
              <a
                href='mailto:shop@email.com'
                className='text-blue-600 font-medium text-base hover:text-blue-700 hover:underline transition'
              >
                shop@email.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
