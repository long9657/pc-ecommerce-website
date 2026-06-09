import { Link } from 'react-router'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'

export default function TopBar() {
  return (
    <div className='bg-black text-white text-[10px] md:text-xs font-semibold py-2 px-4'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-2'>
        <div className='flex items-center gap-2 opacity-80'>
          <span>Mon-Thu: 9:00 AM - 5:30 PM</span>
          <svg className='w-3 h-3 cursor-pointer hover:opacity-100 transition' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
          </svg>
        </div>

        <div className='opacity-80 text-center flex-1'>
          Visit our showroom in 1234 Street Adress City Address, 1234{' '}
          <Link to='/contact' className='underline hover:text-primary hover:opacity-100 transition ml-1'>
            Contact Us
          </Link>
        </div>

        <div className='flex items-center gap-3 opacity-90'>
          <span>Call Us: (00) 1234 5678</span>
          <a href='#' className='hover:text-primary transition text-[14px]'>
            <FaFacebookF />
          </a>
          <a href='#' className='hover:text-primary transition text-[14px]'>
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  )
}
