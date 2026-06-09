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
      cat.name.toLowerCase().includes(pattern.toLowerCase())
    )
    if (found) {
      let path = `/products?category=${generateNameId({ name: found.name, id: found._id })}`
      if (keyword) {
        path += `&search=${encodeURIComponent(keyword)}`
      }
      return path
    }
    return '/products'
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
            <h2 className='text-white text-3xl font-light mb-1'>Sign Up To Our Newsletter.</h2>
            <p className='text-sm text-gray-400'>Be the first to hear about the latest offers.</p>
          </div>
          <div className='flex gap-3 flex-1 max-w-sm min-w-[280px] md:justify-end'>
            <input
              type='email'
              placeholder='Your Email'
              className='flex-1 max-w-[250px] bg-transparent border border-white/20 rounded-md px-4 py-2 text-white text-sm focus:outline-none focus:border-white/50 transition-colors'
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
            <ul className='space-y-2.5 text-[12px] opacity-70 font-medium'>
              {[
                { name: 'About Us', link: '/contact', isPlaceholder: true },
                { name: 'About Zip', link: '/contact', isPlaceholder: true },
                { name: 'Privacy Policy', link: '/contact', isPlaceholder: true },
                { name: 'Search', link: '/products' },
                { name: 'Terms', link: '/contact', isPlaceholder: true },
                { name: 'Orders and Returns', link: '/bills' },
                { name: 'Contact Us', link: '/contact' },
                { name: 'Advanced Search', link: '/products' },
                { name: 'Newsletter Subscription', link: '/login', isPlaceholder: true }
              ].map((item) => (
                <li key={item.name}>
                  {item.isPlaceholder ? (
                    <a
                      href='#'
                      onClick={(e) => handlePlaceholderClick(e, item.name)}
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
            <Link to={getCategoryLink('Linh Kiện')}>
              <h3 className='text-white text-[13px] font-bold mb-5 hover:text-primary transition-colors'>PC Parts</h3>
            </Link>
            <ul className='space-y-2.5 text-[12px] opacity-70 font-medium'>
              {[
                { name: 'CPUs', keyword: 'CPU' },
                { name: 'Add On Cards', keyword: 'Card|Adapter' },
                { name: 'Hard Drives (Internal)', keyword: 'SSD|HDD' },
                { name: 'Graphic Cards', keyword: 'RTX|GTX|Card Màn Hình' },
                { name: 'Keyboards / Mice', isAcc: true },
                { name: 'Cases / Power Supplies / Cooling', keyword: 'Thor|Power|Case|Cooling' },
                { name: 'RAM (Memory)', keyword: 'Ram|Memory' },
                { name: 'Software', keyword: 'Software|Windows|Office' },
                { name: 'Speakers / Headsets', isAcc: true },
                { name: 'Motherboards', keyword: 'Mainboard|Motherboard|Main' }
              ].map((item) => {
                let link = ''
                if (item.isAcc) {
                  link = getCategoryLink('Phụ Kiện')
                } else {
                  link = getCategoryLink('Linh Kiện', item.keyword)
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
            <ul className='space-y-2.5 text-[12px] opacity-70 font-medium'>
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
            <ul className='space-y-2.5 text-[12px] opacity-70 font-medium'>
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
            <div className='text-[12px] opacity-70 space-y-2.5 leading-relaxed font-medium'>
              <p>Address: Km 10 Nguyen Trai, Ha Noi</p>
              <p>
                Phones:{' '}
                <a href='tel:00500584766' className='text-primary hover:text-white transition-colors'>
                  (00) 500 584 766
                </a>
              </p>
              <p>We are open: Monday-Thursday: 9:00 AM - 5:30 PM</p>
              <p>Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 11:00 AM - 5:00 PM</p>
              <p>
                E-mail:{' '}
                <a href='mailto:shop@email.com' className='text-primary hover:text-white transition-colors'>
                  shop@email.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='border-t border-white/10 py-4 px-4'>
        <div className='container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 text-xs opacity-60'>
          <Link to='/' className='text-primary font-bold text-sm hover:text-white transition-colors'>
            PCStore
          </Link>
          <span>Copyright © 2026 PCStore. All rights reserved.</span>
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
