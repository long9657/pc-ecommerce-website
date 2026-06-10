import { Link } from 'react-router'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'

export default function TopBar() {
  return (
    <div className='bg-black text-white text-[10px] md:text-xs font-semibold py-2.5 px-4'>
      <div className='container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-2'>
        <div className='relative group flex items-center gap-1.5 cursor-pointer'>
          <span className='opacity-70 group-hover:opacity-100 transition-opacity'>Mon-Thu:</span>
          <span className='font-bold opacity-90 group-hover:opacity-100 transition-opacity'>9:00 AM - 5:30 PM</span>
          <svg className='w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:-rotate-180 transition-all duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M19 9l-7 7-7-7' />
          </svg>

          {/* Dropdown for Shop Info */}
          <div className='absolute top-full left-0 mt-3 w-72 bg-white text-dark rounded shadow-[0_4px_20px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-left group-hover:translate-y-0 translate-y-2 border border-gray-200 cursor-default'>
            {/* Triangle pointer */}
            <div className='absolute -top-2 left-6 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45'></div>
            
            <div className='relative bg-white rounded z-10 font-sans text-[13px] font-normal'>
              {/* Section 1: Hours */}
              <div className='p-5 flex gap-4'>
                <svg className='w-6 h-6 text-primary flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <circle cx='12' cy='12' r='10' strokeWidth='2' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6l3 3' />
                </svg>
                <div className='space-y-1.5'>
                  <div className='text-gray-900'>We are open:</div>
                  <div className='flex gap-1'>
                    <span className='text-gray-400 font-bold'>Mon-Thu:</span>
                    <span className='text-black font-bold'>9:00 AM - 5:30 PM</span>
                  </div>
                  <div className='flex gap-1'>
                    <span className='text-gray-400 font-bold'>Fr:</span>
                    <span className='text-black font-bold'>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className='flex gap-1'>
                    <span className='text-gray-400 font-bold'>Sat:</span>
                    <span className='text-black font-bold'>11:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </div>

              <div className='h-px bg-gray-200 w-full'></div>

              {/* Section 2: Address */}
              <div className='p-5 flex gap-4'>
                <svg className='w-6 h-6 text-primary flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                <div className='text-black leading-tight mt-0.5'>
                  Address: 1234 Street Adress,<br/>City Address, 1234
                </div>
              </div>

              <div className='h-px bg-gray-200 w-full'></div>

              {/* Section 3: Contact */}
              <div className='p-5 pl-[3.25rem] space-y-2'>
                <div className='flex gap-1'>
                  <span className='text-black'>Phones:</span>
                  <a href='tel:0012345678' className='text-primary hover:underline'>(00) 1234 5678</a>
                </div>
                <div className='flex gap-1'>
                  <span className='text-black'>E-mail:</span>
                  <a href='mailto:shop@email.com' className='text-primary hover:underline'>shop@email.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='opacity-70 text-center flex-1'>
          Visit our showroom in 1234 Street Adress City Address, 1234{' '}
          <Link to='/contact' className='underline hover:text-white hover:opacity-100 transition ml-1 font-bold'>
            Contact Us
          </Link>
        </div>

        <div className='flex items-center gap-3'>
          <span className='font-bold opacity-90'>Call Us: (00) 1234 5678</span>
          <div className='flex items-center gap-2 ml-2'>
            <a href='#' className='w-6 h-6 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white hover:text-black transition-all text-[12px]'>
              <FaFacebookF />
            </a>
            <a href='#' className='w-6 h-6 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white hover:text-black transition-all text-[12px]'>
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
