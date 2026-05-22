import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { MOCK_PRODUCTS } from '../../utils/mockProducts'

const MOCK_HERO_SLIDES = [
  {
    id: 1,
    title: 'SCORE A BONUS GAMING MONITOR',
    subtitle: 'MSI ULTIMATE BUNDLE EVENT',
    description: 'Purchase selected MSI Gaming Desktops or Laptops with Intel Core i7/i9 processors and claim a premium 170Hz Esports Monitor for FREE.',
    image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=1200',
    themeColor: 'rgb(220, 38, 38)',
    ctaText: 'Shop MSI Bundles'
  },
  {
    id: 2,
    title: 'THE ULTIMATE IMMERSION',
    subtitle: 'QD-OLED GAMING MONITORS',
    description: 'Experience stunning color accuracy, true blacks, and blistering 0.03ms response time with the new generation ROG Swift QD-OLED.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1200',
    themeColor: 'rgb(6, 182, 212)',
    ctaText: 'Explore OLED'
  }
]

const MOCK_CATEGORIES = [
  { name: 'Laptops', count: 124, icon: '💻', gradient: 'from-blue-500 to-indigo-600' },
  { name: 'Desktop PCs', count: 85, icon: '🖥️', gradient: 'from-purple-500 to-pink-600' },
  { name: 'Peripherals', count: 342, icon: '⌨️', gradient: 'from-cyan-500 to-teal-600' },
  { name: 'PC Parts', count: 512, icon: '🔌', gradient: 'from-orange-500 to-red-600' }
]

const MOCK_BRANDS = [
  { name: 'MSI', hoverColor: 'hover:text-red-500' , link:'https://vn.msi.com/'},
  { name: 'Razer', hoverColor: 'hover:text-green-500', link: 'https://www.razer.com/'},
  { name: 'Gigabyte', hoverColor: 'hover:text-blue-500', link: 'https://www.gigabyte.com/'},
  { name: 'ASUS ROG', hoverColor: 'hover:text-rose-600', link: 'https://rog.asus.com/' }
]

const FEATURED_SECTIONS = [
  { 
    brand: 'MSI', 
    category: 'Laptops', 
    title: 'MSI Laptops', 
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    brand: 'Razer', 
    category: 'Laptops', 
    title: 'Razer Laptops', 
    bannerImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400' 
  }
]


const MOCK_INSTAGRAM_POSTS = [
  {
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=300',
    description: 'If you’ve recently purchased a laptop, here are the top things you should do first.',
    date: '01.07.2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300',
    description: 'Unboxing the monster MSI Aegis gaming desktop. Power unleashed!',
    date: '12.06.2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=300',
    description: 'Clean setup check! Rate this minimal RGB workspace from 1 to 10.',
    date: '28.05.2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=300',
    description: 'We are official partners with Razer! Claim your esports swag now.',
    date: '15.05.2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300',
    description: 'The colors on this new ROG Swift OLED are absolutely jaw-dropping.',
    date: '08.05.2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=300',
    description: 'Work hard, game harder. Blade 16 handles everything seamlessly.',
    date: '01.05.2026'
  }
]

const MOCK_FIGMA_REVIEWS = [
  {
    author: 'Tama Brown',
    comment: 'My first order arrived today in perfect condition. From the time I sent a question about the product to the delivery, the service was outstanding. Highly recommended!'
  },
  {
    author: 'Sarah Jenkins',
    comment: 'Incredible customer support. They helped me choose the exact components for my custom build and checked compatibility. Everything runs flawlessly.'
  },
  {
    author: 'David Chen',
    comment: 'Super fast delivery and pristine packaging. The MSI Aegis desktop was safely padded and booted up instantly. 5 stars all the way.'
  }
]


export default function ProductList() {
  const navigate = useNavigate()
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)
  const [activeReviewIdx, setActiveReviewIdx] = useState(0)

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % MOCK_HERO_SLIDES.length)
  }
  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + MOCK_HERO_SLIDES.length) % MOCK_HERO_SLIDES.length)
  }
  const filteredProducts = MOCK_PRODUCTS
  return (
    <div className='p-6 bg-slate-100 min-h-screen'>
      <div className='relative w-full h-[400px] rounded-3xl overflow-hidden shadow-xl mt-6 group bg-slate-950'>
        <div 
          className='absolute inset-0 w-full h-full flex flex-col justify-center transition-all duration-700 bg-cover bg-center'
          style={{
            backgroundImage: `linear-gradient(to right, rgba(2, 6, 23, 0.95) 40%, rgba(2, 6, 23, 0.5) 70%, rgba(2, 6, 23, 0.15) 100%), url(${MOCK_HERO_SLIDES[currentHeroSlide].image})`
          }}
        >
          <div className='max-w-xl px-12 md:px-20 text-white z-10 select-none'>
            <span 
              className='text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full text-white'
              style={{ backgroundColor: MOCK_HERO_SLIDES[currentHeroSlide].themeColor }}
            >
              {MOCK_HERO_SLIDES[currentHeroSlide].subtitle}
            </span>
            
            <h1 className='text-3xl md:text-4xl font-extrabold mt-4 tracking-tight leading-tight uppercase font-sans'>
              {MOCK_HERO_SLIDES[currentHeroSlide].title}
            </h1>
            
            <p className='text-slate-300 mt-3 text-xs md:text-sm leading-relaxed max-w-md font-medium opacity-90'>
              {MOCK_HERO_SLIDES[currentHeroSlide].description}
            </p>
            
            <button 
              onClick={() => {
                if (currentHeroSlide === 0) {
                  navigate('/products?brand=MSI')
                } else {
                  navigate('/products?category=PC Parts')
                }
              }}
              className='mt-6 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer duration-300'
              style={{ 
                backgroundColor: MOCK_HERO_SLIDES[currentHeroSlide].themeColor,
                boxShadow: `0 4px 15px ${MOCK_HERO_SLIDES[currentHeroSlide].themeColor}40`
              }}
            >
              {MOCK_HERO_SLIDES[currentHeroSlide].ctaText}
            </button>
          </div>
        </div>
        <button 
          onClick={prevHeroSlide} 
          className='absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-700/50 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 shadow-md'
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextHeroSlide} 
          className='absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-700/50 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 shadow-md'
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        

        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
          {MOCK_HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentHeroSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-slate-600'}`}
            />
          ))}
        </div>
      </div>

      <div className='bg-white py-6 border-b border-slate-200 shadow-sm -mx-6 px-6'>
        <div className='max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-8'>
          <span className='text-xs font-bold uppercase text-slate-400 tracking-wider'>
            Authorized Partner:
          </span>
          <div className='flex items-center gap-12 overflow-x-auto scrollbar-none'>
            {MOCK_BRANDS.map((brand, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/products?brand=${brand.name}`)}
                className={`font-black text-slate-700 tracking-widest text-lg md:text-xl transition-colors duration-300 cursor-pointer bg-transparent border-none outline-none ${brand.hoverColor}`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <div className='flex items-baseline justify-between'>
          <h2 className='text-xl font-extrabold text-slate-900 tracking-tight'>
            Browse Categories
          </h2>
          <span className='text-xs text-slate-400 font-semibold'>
            Filter hardware by custom components
          </span>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-5 gap-6 mt-6'>
          <div
            onClick={() => navigate('/products')}
            className={`border rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md bg-white border-slate-200/60 text-slate-800`}
          >
            <div className='w-12 h-12 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center text-xl mx-auto shadow-sm'>
              📦
            </div>
            <h3 className='font-bold text-xs mt-3 uppercase tracking-wider'>All Products</h3>
            <span className='text-[10px] opacity-60 mt-1 block font-semibold'>Show all hardware</span>
          </div>

          
          {MOCK_CATEGORIES.map((cat, idx) => {
            return (
              <div
                key={idx}
                onClick={() => navigate(`/products?category=${cat.name}`)}
                className={`border rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md bg-white border-slate-200/60 text-slate-800`}
              >
                <div className={`w-12 h-12 bg-gradient-to-tr ${cat.gradient} text-white rounded-xl flex items-center justify-center text-xl mx-auto shadow-md`}>
                  {cat.icon}
                </div>
                
                <h3 className='font-bold text-xs mt-3 uppercase tracking-wider'>{cat.name}</h3>
                <span className={`text-[10px] mt-1 block font-semibold text-slate-400`}>
                  {cat.count} Items
                </span>
              </div>
            )
          })}
        </div>


             
      <div className='mt-12 space-y-16'>
        {FEATURED_SECTIONS.map((section) => (
          <div key={section.brand} className='mt-8'>
            
            <div className='flex gap-6 border-b border-slate-200 pb-3 mb-6'>
              <button 
                onClick={() => navigate(`/products?brand=${section.brand}`)}
                className='font-bold text-xs uppercase border-b-2 border-blue-600 pb-3 -mb-3 text-slate-900 cursor-pointer'
              >
                {section.brand} GS Series
              </button>
              <button 
                onClick={() => navigate(`/products?brand=${section.brand}`)}
                className='font-semibold text-xs uppercase text-slate-400 hover:text-slate-900 pb-3 cursor-pointer transition'
              >
                {section.brand} GT Series
              </button>
              <button 
                onClick={() => navigate(`/products?brand=${section.brand}`)}
                className='font-semibold text-xs uppercase text-slate-400 hover:text-slate-900 pb-3 cursor-pointer transition'
              >
                {section.brand} GL Series
              </button>
              <button 
                onClick={() => navigate(`/products?brand=${section.brand}`)}
                className='font-semibold text-xs uppercase text-slate-400 hover:text-slate-900 pb-3 cursor-pointer transition'
              >
                {section.brand} GE Series
              </button>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
              
              <div 
                className='w-full lg:w-[230px] flex-shrink-0 h-[380px] rounded-xl overflow-hidden relative flex flex-col justify-between p-6 text-white text-center bg-cover bg-center shadow-md animate-fade-in'
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url('${section.bannerImage}')`
                }}
              >
                <div />
                
                <div>
                  <h2 className='text-xl font-extrabold tracking-wide uppercase leading-tight'>
                    {section.title}
                  </h2>
                </div>
                
                <div>
                  <span 
                    onClick={() => navigate(`/products?brand=${section.brand}&category=${section.category}`)}
                    className='text-[10px] font-bold uppercase tracking-wider border-b border-white pb-1 hover:opacity-80 transition cursor-pointer'
                  >
                    See All Products
                  </span>
                </div>
              </div>

              
              <div className='flex-1 grid grid-cols-2 md:grid-cols-4 gap-4'>
                {filteredProducts
                  .filter((product) => product.brand === section.brand && product.category === section.category)
                  .map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`}
                      className='bg-white rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100/80 group block text-inherit no-underline'
                    >
                      <div>
                        <div className='flex items-center gap-1 text-[9px] font-bold'>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className={product.inStock ? 'text-emerald-600' : 'text-rose-500'}>
                            {product.inStock ? 'in stock' : 'out of stock'}
                          </span>
                        </div>

                        <div className='h-32 my-4 flex items-center justify-center overflow-hidden bg-slate-50 rounded-lg p-2'>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300' 
                          />
                        </div>

                        <div className='flex items-center gap-1 mt-2'>
                          <div className='flex text-amber-400'>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-3 h-3 fill-current ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'}`} 
                                viewBox='0 0 20 20'
                              >
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                              </svg>
                            ))}
                          </div>
                          <span className='text-[9px] text-slate-400 font-semibold'>
                            Reviews ({product.reviewsCount})
                          </span>
                        </div>

                        <h3 className='text-xs font-bold text-slate-700 mt-2 leading-snug line-clamp-2 min-h-[32px] hover:text-blue-600 transition-colors'>
                          {product.name}
                        </h3>
                      </div>

                      <div className='mt-4 pt-2 border-t border-slate-50'>
                        {product.oldPrice && (
                          <span className='text-[10px] line-through text-slate-400 block'>
                            ${product.oldPrice.toFixed(2)}
                          </span>
                        )}
                        <div className='text-sm font-black text-slate-900'>
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      <div className='mt-16'>
        <h2 className='text-lg font-bold text-slate-800 tracking-tight font-sans'>
          Follow us on Instagram for News, Offers & More
        </h2>
        
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6'>
          {MOCK_INSTAGRAM_POSTS.map((post, idx) => (
            <div key={idx} className='bg-white rounded-lg overflow-hidden border border-slate-100 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300'>
              <div className='h-36 overflow-hidden'>
                <img 
                  src={post.image} 
                  alt={`Insta post ${idx}`} 
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-500' 
                />
              </div>
              <div className='p-3 flex flex-col justify-between flex-1'>
                <p className='text-[10px] text-slate-500 leading-relaxed line-clamp-3 font-medium'>
                  {post.description}
                </p>
                <span className='text-[9px] text-slate-300 font-bold mt-3 block'>
                  {post.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className='mt-16 bg-[#F5F7FF] rounded-2xl p-10 md:p-14 relative flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-50/50 shadow-sm'>
        <div className='absolute left-8 top-6 text-blue-200/50 text-7xl font-serif select-none pointer-events-none'>
          “
        </div>
        
        <div className='flex-1 max-w-2xl z-10'>
          <p className='text-slate-700 text-sm md:text-base font-medium leading-relaxed italic'>
            "{MOCK_FIGMA_REVIEWS[activeReviewIdx].comment}"
          </p>
          <span className='text-xs font-bold text-slate-500 mt-4 block'>
            - {MOCK_FIGMA_REVIEWS[activeReviewIdx].author}
          </span>

          <div className='flex gap-2 mt-8'>
            {MOCK_FIGMA_REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeReviewIdx === idx ? 'bg-blue-600 w-5' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className='z-10 flex-shrink-0'>
          <button className='px-6 py-2.5 border-2 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-extrabold rounded-full transition-all duration-300 cursor-pointer uppercase tracking-wider shadow-sm shadow-blue-100 hover:shadow-md'>
            Leave Us A Review
          </button>
        </div>
      </div>
    </div>
  );
}
