import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../api/category.api'
import { generateNameId } from '../../utils/utils'

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  })
  const categories = categoriesData?.data?.result || []

  // Helper to resolve category ID and search keyword dynamically
  const getCategoryLink = (pattern: string, keyword?: string) => {
    const found = categories.find((cat: any) =>
      cat.name.toLowerCase().includes(pattern.toLowerCase()) || pattern.toLowerCase().includes(cat.name.toLowerCase())
    )
    let path = '/products'
    if (found) {
      path += `?category=${generateNameId({ name: found.name, id: found._id })}`
    }
    if (keyword) {
      path += (path.includes('?') ? '&' : '?') + `search=${encodeURIComponent(keyword)}`
    }
    return path
  }

  const handlePlaceholderClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault()
    setModalTitle(title)
    setIsOpen(true)
  }

  return (
    <footer className='bg-black text-gray-400 relative font-sans text-xs'>
      <div className='py-12 px-4'>
        <div className='container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6'>
          <div>
            <h2 className='text-white text-[32px] md:text-[38px] font-medium mb-1 tracking-tight'>Sign Up To Our Newsletter.</h2>
            <p className='text-sm text-gray-400 font-medium'>Be the first to hear about the latest offers.</p>
          </div>
          <div className='flex gap-3 flex-1 max-w-sm min-w-[280px] md:justify-end'>
            <input
              type='email'
              placeholder='Your Email'
              className='flex-1 max-w-[250px] bg-black border-2 border-white rounded-md px-4 py-2 text-white text-sm focus:outline-none transition-colors'
            />
            <button className='bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors'>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className='container mx-auto max-w-7xl px-4 py-12 border-t border-white/10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8'>
          <div>
            <Link to='/products'>
              <h3 className='text-white text-[13px] font-bold mb-5 hover:text-primary transition-colors'>Information</h3>
            </Link>
            <ul className='space-y-2.5 text-[12px] text-white opacity-80 font-medium'>
              {[
                { name: 'About Us', link: '/about' },
                { name: 'About Zip', link: '/about-zip' },
                { name: 'Privacy Policy', link: '/privacy' },
                { name: 'Search', link: '/products' },
                { name: 'Terms', link: '/faq' },
                { name: 'Orders and Returns', link: '/bills' },
                { name: 'Contact Us', link: '/contact' },
                { name: 'Advanced Search', link: '/products' },
                { name: 'Newsletter Subscription', link: '#newsletter', isScroll: true }
              ].map((item) => (
                <li key={item.name}>
                  {item.isScroll ? (
                    <a
                      href={item.link}
                      onClick={(e) => {
                        e.preventDefault()
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        setTimeout(() => document.querySelector<HTMLInputElement>('input[type="email"]')?.focus(), 500)
                      }}
                      className='hover:text-white transition-colors cursor-pointer'
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      className='hover:text-white transition-colors'
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Link to={getCategoryLink('PC Parts')}>
              <h3 className='text-white text-[13px] font-bold mb-5 hover:text-primary transition-colors'>PC Parts</h3>
            </Link>
            <ul className='space-y-2.5 text-[12px] text-white opacity-80 font-medium'>
              {[
                { name: 'CPUs', keyword: 'CPU' },
                { name: 'Add On Cards', keyword: 'Card|Adapter' },
                { name: 'Hard Drives (Internal)', keyword: 'SSD|HDD' },
                { name: 'Graphic Cards', keyword: 'RTX|GTX|Card Màn Hình' },
                { name: 'Keyboards / Mice', isAcc: true, keyword: 'Keyboard|Mouse|Chuột|Bàn Phím' },
                { name: 'Cases / Power Supplies / Cooling', keyword: 'Thor|Power|Case|Cooling' },
                { name: 'RAM (Memory)', keyword: 'Ram|Memory' },
                { name: 'Software', keyword: 'Software|Windows|Office' },
                { name: 'Speakers / Headsets', isAcc: true, keyword: 'Speaker|Headset|Tai nghe|Loa' },
                { name: 'Motherboards', keyword: 'Mainboard|Motherboard|Main' }
              ].map((item) => {
                let link = ''
                if (item.isAcc) {
                  link = getCategoryLink('Accessories', item.keyword)
                } else {
                  link = getCategoryLink('PC Parts', item.keyword)
                }
                return (
                  <li key={item.name}>
                    <Link to={link} className='hover:text-white transition-colors'>
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <Link to={getCategoryLink('PC')}>
              <h3 className='text-white text-[13px] font-bold mb-5 hover:text-primary transition-colors'>Desktop PCs</h3>
            </Link>
            <ul className='space-y-2.5 text-[12px] text-white opacity-80 font-medium'>
              {[
                { name: 'Custom PCs', keyword: 'Gaming|Custom' },
                { name: 'Servers', keyword: 'Xeon|Server' },
                { name: 'MSI All-In-One PCs', keyword: 'AIO|All-In-One|MSI' },
                { name: 'HP/Compaq PCs', keyword: 'HP|Compaq' },
                { name: 'ASUS PCs', keyword: 'ASUS' },
                { name: 'Tecs PCs', keyword: 'Tecs' }
              ].map((item) => {
                const link = getCategoryLink('PC', item.keyword)
                return (
                  <li key={item.name}>
                    <Link to={link} className='hover:text-white transition-colors'>
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <Link to={getCategoryLink('Laptop')}>
              <h3 className='text-white text-[13px] font-bold mb-5 hover:text-primary transition-colors'>Laptops</h3>
            </Link>
            <ul className='space-y-2.5 text-[12px] text-white opacity-80 font-medium'>
              {[
                { name: 'Everyday Use Notebooks', keyword: 'XPS|Dell|Everyday' },
                { name: 'MSI Workstation Series', keyword: 'MacBook Pro|Workstation' },
                { name: 'MSI Prestige Series', keyword: 'Prestige|MSI' },
                { name: 'Tablets and Pads', keyword: 'Tablet|Pad|iPad' },
                { name: 'Netbooks', keyword: 'Netbook' },
                { name: 'Infinity Gaming Notebooks', keyword: 'Legion|Strix|Gaming' }
              ].map((item) => {
                const link = getCategoryLink('Laptop', item.keyword)
                return (
                  <li key={item.name}>
                    <Link to={link} className='hover:text-white transition-colors'>
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 className='text-white text-[13px] font-bold mb-5'>Address</h3>
            <div className='text-[12px] text-white opacity-80 space-y-1 leading-loose font-medium'>
              <p>Address: 1234 Street Adress City Address, 1234</p>
              <p>
                Phones:{' '}
                <a href='tel:0012345678' className='text-[#01A4FF] hover:text-white transition-colors font-semibold'>
                  (00) 1234 5678
                </a>
              </p>
              <p>We are open: Monday-Thursday: 9:00 AM - <br/> 5:30 PM</p>
              <p>Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 11:00 AM - 5:00 PM</p>
              <p>
                E-mail:{' '}
                <a href='mailto:shop@email.com' className='text-[#01A4FF] hover:text-white transition-colors font-semibold'>
                  shop@email.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='border-t border-white/10 py-6 px-4'>
        <div className='container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] opacity-60'>
          <div className='flex items-center gap-4 text-white opacity-80'>
            {/* Facebook */}
            <a href='#' className='hover:text-primary transition-colors'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'><path d='M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z'/></svg>
            </a>
            {/* Instagram */}
            <a href='#' className='hover:text-primary transition-colors'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/></svg>
            </a>
          </div>

          <div className='flex items-center gap-1.5 opacity-80'>
            <div className='bg-[#0070BA] text-white px-2 py-0.5 rounded text-[8px] font-black italic'>PayPal</div>
            <div className='bg-[#1A1F71] text-white px-2 py-0.5 rounded text-[8px] font-bold italic'>VISA</div>
            <div className='bg-[#EB001B] text-white px-2 py-0.5 rounded text-[8px] font-bold'>mastercard</div>
            <div className='bg-[#E55C20] text-white px-2 py-0.5 rounded text-[8px] font-bold'>DISCOVER</div>
            <div className='bg-[#002663] text-white px-2 py-0.5 rounded text-[8px] font-bold'>AMEX</div>
          </div>

          <span className='font-medium text-gray-500'>Copyright © 2020 Shop Pty. Ltd.</span>
        </div>
      </div>

      {/* Premium Glassmorphic Notification Modal */}
      {isOpen && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-300'>
          <div className='bg-white/95 rounded-2xl p-7 max-w-sm w-full mx-4 shadow-2xl border border-white/20 text-center transform scale-100 transition-all'>
            <div className='w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner'>
              <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h4 className='text-gray-900 font-extrabold text-xl mb-2'>{modalTitle}</h4>
            <p className='text-gray-600 text-sm leading-relaxed mb-6'>
              Trang thông tin này đang được nâng cấp và sẽ sớm ra mắt quý khách trong phiên bản tiếp theo. Xin cảm ơn sự thông cảm của bạn!
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className='w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transition-all cursor-pointer'
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}
