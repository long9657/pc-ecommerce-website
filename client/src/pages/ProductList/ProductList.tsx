import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts } from '../../api/product.api'
import { addToCart } from '../../api/purchase.api'
import { generateNameId } from '../../utils/utils'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'motion/react'

const HERO_SLIDES = [
  {
    id: 1,
    brand: 'msi',
    tag: 'ONLY JAN 1 - JAN 31',
    title: 'SCORE A BONUS GAMING MONITOR',
    image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=1400',
    btnText: 'SHOP NOW',
    color: 'bg-[#E83C45]'
  },
  {
    id: 2,
    brand: 'razer',
    tag: 'NEW ARRIVAL',
    title: 'THE ULTIMATE GAMING LAPTOP',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1400',
    btnText: 'DISCOVER MORE',
    color: 'bg-[#44d62c]'
  }
]

const TESTIMONIALS = [
  {
    text: "My first order arrived today in perfect condition. From the time I sent a question about the item to making the purchase, to the shipping and now the delivery, your company, Tecs, has stayed in touch. Such great service. I look forward to shopping on your site in the future and would highly recommend it.",
    author: "Tama Brown"
  },
  {
    text: "I was hesitant to buy a pre-built PC online, but the build quality and cable management exceeded my expectations. The system booted right up, and customer support was incredibly helpful when I had a question about the motherboard drivers. 10/10 would buy again.",
    author: "James Wilson"
  },
  {
    text: "The delivery was lightning fast! Placed an order for an RTX 4080 and a new power supply on Tuesday, and it was at my doorstep by Thursday morning. Everything was packaged securely with plenty of bubble wrap. You've earned a customer for life.",
    author: "Sarah Jenkins"
  }
]

const CATEGORY_ROWS = [
  {
    id: 'custom-builds',
    title: 'Custom Builds',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400',
    tabs: []
  },
  {
    id: 'laptops',
    title: 'MSI Laptops',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400',
    tabs: ['MSI GS Series', 'MSI GT Series', 'MSI GL Series', 'MSI GE Series']
  },
  {
    id: 'desktops',
    title: 'Desktops',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=400',
    tabs: ['MSI Infinite Series', 'MSI Triden', 'MSI GL Series', 'MSI Nightblade']
  }
]

const BRAND_LOGOS = [
  { name: 'ROCCAT', url: '/brands/roccat.svg' },
  { name: 'MSI', url: '/brands/msi.svg' },
  { name: 'RAZER', url: '/brands/razer.svg' },
  { name: 'THERMALTAKE', url: '/brands/thermaltake.svg' },
  { name: 'ADATA', url: '/brands/adata.svg' },
  { name: 'HP', url: '/brands/hp.svg' },
  { name: 'GIGABYTE', url: '/brands/gigabyte.svg' }
]

const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=300&h=300',
    text: 'If you’ve recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup...',
    date: '01.09.2023'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=300&h=300',
    text: 'Upgrading your graphics card can breathe new life into your gaming experience. Check out our latest stock of RTX 40 series GPUs!',
    date: '15.08.2023'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=300&h=300',
    text: 'Mechanical keyboards: a small upgrade with a massive impact on your daily typing and gaming sessions. Which switches do you prefer?',
    date: '22.07.2023'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=300&h=300',
    text: 'Portability meets performance! The new MSI Creator series laptops are now available. Perfect for video editing and 3D rendering on the go.',
    date: '10.07.2023'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=300&h=300',
    text: 'Don’t let your PC overheat this summer. We just received a huge batch of AIO liquid coolers from top brands. Keep those temps down!',
    date: '05.06.2023'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=300&h=300',
    text: 'Build of the week: A stunning all-white custom loop PC featuring the latest Intel i9 and custom braided cables. Rate this build 1-10!',
    date: '28.05.2023'
  }
]

export default function ProductList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [newProductsIndex, setNewProductsIndex] = useState(0)
  const [heroIndex, setHeroIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})

  useEffect(() => {
    const initialTabs: Record<string, string> = {}
    CATEGORY_ROWS.forEach(row => {
      if (row.tabs.length > 0) {
        initialTabs[row.id] = ''
      }
    })
    setActiveTabs(initialTabs)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({ limit: 1000 })
  })

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addToCart({ product_id: productId, buy_count: 1 }),
    onSuccess: () => {
      toast.success('Đã thêm sản phẩm vào giỏ hàng!')
      queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
    },
    onError: (error: any) => {
      if (error.response?.status === 422 || error.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!')
      } else {
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!')
      }
    }
  })

  const products = productsData?.data?.result?.products || []

  const renderProductCard = (product: any) => {
    const inStock = product.quantity > 0;
    return (
      <div 
        key={product._id} 
        className='bg-white flex flex-col hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 group p-2 relative cursor-pointer'
        onClick={() => navigate(`/product/${generateNameId({ name: product.name, id: product._id })}`)}
      >
        <div>
          <div className='flex items-center gap-1 text-[9px] font-semibold mb-2'>
            {inStock ? (
              <>
                <svg className='w-2.5 h-2.5 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/></svg>
                <span className='text-green-500'>in stock</span>
              </>
            ) : (
              <>
                <svg className='w-2.5 h-2.5 text-red-500' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd'/></svg>
                <span className='text-red-500'>out of stock</span>
              </>
            )}
          </div>
          
          <div className='h-32 my-3 flex items-center justify-center relative overflow-hidden'>
            <img
              src={product.image}
              alt={product.name}
              className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out select-none'
            />
          </div>

          <div className='flex items-center gap-1 mb-1.5'>
            <div className='flex text-[#E9A426]'>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-2.5 h-2.5 fill-current ${i < Math.floor(product.rating || 5) ? 'text-[#E9A426]' : 'text-gray-200'}`} viewBox='0 0 20 20'>
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              ))}
            </div>
            <span className='text-[9px] text-gray-400'>Reviews ({product.sold || 4})</span>
          </div>

          <h3 className='text-[11px] text-dark leading-snug line-clamp-3 min-h-[46px] mb-2 font-medium'>
            EX DISPLAY : {product.name}
          </h3>
        </div>
        
        <div className='pt-1 mt-auto'>
          {product.price_before_discount && (
            <span className='text-[10px] line-through text-gray-400 block leading-none select-none mb-1 opacity-100 group-hover:opacity-0 transition-opacity'>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price_before_discount)}
            </span>
          )}
          <div className='text-[14px] font-bold text-dark leading-none opacity-100 group-hover:opacity-0 transition-opacity'>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
          </div>
          
          <div className='absolute bottom-2 left-0 right-0 px-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto'>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCartMutation.mutate(product._id)
              }}
              disabled={!inStock}
              className={`w-full py-2 rounded-full flex items-center justify-center gap-1 border-2 transition-all cursor-pointer font-bold text-[11px] ${inStock ? 'border-primary text-primary hover:bg-primary hover:text-white' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' /></svg>
              {inStock ? 'Add To Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white font-sans text-dark min-h-screen pb-12'>
      <div className='max-w-[1400px] mx-auto px-4 pt-6'>
        
        {/* Hero Section */}
        <div className='relative w-full h-[328px] overflow-hidden mb-12 bg-black cursor-pointer group'>
          <AnimatePresence mode='wait'>
            <motion.img 
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              src={HERO_SLIDES[heroIndex].image} 
              className='absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-90' 
              alt='Hero' 
            />
          </AnimatePresence>
          <AnimatePresence mode='wait'>
            <motion.div 
              key={heroIndex + 'text'}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className='absolute inset-0 flex flex-col justify-center px-16 z-10 pointer-events-none'
            >
              <div className='w-12 h-12 bg-primary flex items-center justify-center text-white font-bold italic text-xl mb-4 pointer-events-auto'>{HERO_SLIDES[heroIndex].brand}</div>
              <div className={`inline-block ${HERO_SLIDES[heroIndex].color} text-white text-xs font-bold px-3 py-1 mb-2 w-max rounded-sm pointer-events-auto`}>{HERO_SLIDES[heroIndex].tag}</div>
              <h1 className='text-4xl text-white font-black italic uppercase max-w-lg leading-tight mb-6 pointer-events-auto'>
                {HERO_SLIDES[heroIndex].title}
              </h1>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate('/products') }}
                className='bg-white text-black font-black italic px-8 py-2.5 w-max hover:bg-gray-100 transition-colors pointer-events-auto'
              >
                {HERO_SLIDES[heroIndex].btnText}
              </button>
            </motion.div>
          </AnimatePresence>
          
          <div 
            onClick={(e) => { e.stopPropagation(); setHeroIndex(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length) }}
            className='absolute top-1/2 left-4 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-transparent text-gray-400 hover:text-white rounded-full cursor-pointer text-2xl font-light z-20'
          >‹</div>
          <div 
            onClick={(e) => { e.stopPropagation(); setHeroIndex(prev => (prev + 1) % HERO_SLIDES.length) }}
            className='absolute top-1/2 right-4 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-transparent text-gray-400 hover:text-white rounded-full cursor-pointer text-2xl font-light z-20'
          >›</div>
        </div>

        {/* New Products */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-[22px] font-semibold text-dark'>New Products</h2>
            <Link to='/products' className='text-[10px] font-bold text-primary underline hover:text-blue-700 transition-colors'>See All New Products</Link>
          </div>
          
          <div className='relative'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
              {products.slice(newProductsIndex, newProductsIndex + 6).map((product: any) => renderProductCard(product))}
            </div>
            {newProductsIndex > 0 && (
              <div 
                onClick={() => setNewProductsIndex(prev => Math.max(0, prev - 1))}
                className='absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full cursor-pointer hover:bg-gray-300 shadow-sm z-10'
              >‹</div>
            )}
            {newProductsIndex < products.length - 6 && (
              <div 
                onClick={() => setNewProductsIndex(prev => Math.min(Math.max(0, products.length - 6), prev + 1))}
                className='absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full cursor-pointer hover:bg-gray-300 shadow-sm z-10'
              >›</div>
            )}
          </div>
        </div>

        {/* Zip Banner */}
        <div className='w-full bg-[#F5F7FF] py-3.5 flex items-center justify-center gap-2 mb-12'>
          <span className='font-black text-[#6631E0] text-xl tracking-tighter'>zip</span>
          <span className='text-gray-600 font-medium text-[13px] border-l border-gray-300 pl-2'>
            own it now, up to 6 months interest free <a href='#' className='underline text-dark hover:text-primary transition-colors ml-1'>learn more</a>
          </span>
        </div>

        {/* Category Rows */}
        <div className='space-y-12'>
          {CATEGORY_ROWS.map((row) => (
            <div key={row.id} className='flex flex-col'>
              {row.tabs.length > 0 && (
                <div className='flex gap-6 mb-4 overflow-x-auto whitespace-nowrap lg:pl-0'>
                  {row.tabs.map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTabs(prev => ({ ...prev, [row.id]: prev[row.id] === tab ? '' : tab }))}
                      className={`text-[13px] font-bold pb-2 border-b-2 transition-colors cursor-pointer ${activeTabs[row.id] === tab ? 'border-primary text-dark' : 'border-transparent text-gray-400 hover:text-dark'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}

              <div className='flex flex-col lg:flex-row gap-2'>
                {/* Vertical Banner */}
                <div className='relative w-full lg:w-[230px] h-[340px] shrink-0 bg-black flex flex-col justify-center items-center text-center overflow-hidden group cursor-pointer'>
                  <div 
                    className='absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105'
                    style={{ backgroundImage: `url(${row.image})` }}
                  />
                  <h2 className='relative z-10 text-white text-2xl font-bold max-w-[150px] leading-tight mb-2'>
                    {row.title.split(' ').map((word, i) => (
                      <span key={i} className={i === 1 ? 'block' : ''}>{word} </span>
                    ))}
                  </h2>
                  <Link to='/products' className='relative z-10 text-white text-[10px] font-bold underline mt-auto mb-8 hover:text-primary transition-colors'>
                    See All Products
                  </Link>
                </div>

                {/* Products Grid */}
                <div className='flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2'>
                  {products
                    .filter((p: any) => {
                      const name = p.name.toLowerCase()
                      const activeTab = activeTabs[row.id]
                      
                      if (row.title === 'MSI Laptops') {
                        const isLaptop = name.includes('laptop') || name.includes('stealth') || name.includes('titan') || name.includes('leopard') || name.includes('raider') || name.includes('gf')
                        if (activeTab === 'MSI GS Series') return isLaptop && name.includes('gs')
                        if (activeTab === 'MSI GT Series') return isLaptop && name.includes('gt')
                        if (activeTab === 'MSI GL Series') return isLaptop && name.includes('gl')
                        if (activeTab === 'MSI GE Series') return isLaptop && name.includes('ge')
                        return isLaptop
                      }
                      if (row.title === 'Desktops') {
                        const isDesktop = name.includes('desktop') || /\bpc\b/.test(name) || name.includes('trident') || name.includes('infinite')
                        if (activeTab === 'MSI Infinite Series') return isDesktop && name.includes('infinite')
                        if (activeTab === 'MSI Triden') return isDesktop && name.includes('trident')
                        if (activeTab === 'MSI GL Series') return isDesktop && name.includes('gl')
                        if (activeTab === 'MSI Nightblade') return isDesktop && name.includes('nightblade')
                        return isDesktop
                      }
                      if (row.title === 'Custom Builds') return name.includes('custom') || name.includes('build')
                      return true
                    })
                    .slice(0, 5)
                    .map((product: any) => renderProductCard(product))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Logos */}
        <div className='flex flex-wrap items-center justify-center md:justify-between gap-8 py-16 mt-8'>
          {BRAND_LOGOS.map((brand, idx) => (
            <div key={idx} onClick={() => navigate(`/products?search=${encodeURIComponent(brand.name)}`)} className='cursor-pointer group flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300 w-24 h-8 grayscale hover:grayscale-0'>
              <img src={brand.url} alt={brand.name} className='max-w-full max-h-full object-contain' />
            </div>
          ))}
        </div>

        {/* Instagram/News Section */}
        <div className='mb-20'>
          <h2 className='text-center text-[22px] font-bold text-dark mb-10'>Follow us on Instagram for News, Offers & More</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {INSTAGRAM_POSTS.map(post => (
              <div key={post.id} className='flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer'>
                <div className='w-full aspect-[4/3] overflow-hidden bg-gray-100'>
                  <img 
                    src={post.image} 
                    alt='Instagram post'
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                  />
                </div>
                <div className='p-4 flex flex-col items-center text-center'>
                  <p className='text-[10px] text-gray-500 leading-relaxed line-clamp-4 mb-3'>
                    {post.text}
                  </p>
                  <p className='text-[9px] text-gray-400 font-medium'>{post.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Section */}
        <div className='bg-[#F5F7FF] py-16 px-4 mb-20 relative flex flex-col items-center justify-center rounded-sm w-full overflow-hidden'>
          <div className='max-w-3xl w-full mx-auto flex items-start gap-4 min-h-[140px]'>
            <div className='text-5xl font-serif text-dark opacity-30 mt-[-10px]'>“</div>
            <div className='flex-1'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className='w-full'
                >
                  <p className='text-[14px] leading-relaxed text-dark text-left'>
                    {TESTIMONIALS[testimonialIndex].text}
                  </p>
                  <div className='flex justify-end mt-4'>
                    <p className='text-[13px] font-bold text-dark'>- {TESTIMONIALS[testimonialIndex].author}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          <div className='flex gap-2 mt-4'>
            {TESTIMONIALS.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setTestimonialIndex(i)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors duration-300 ${i === testimonialIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'}`}
              ></div>
            ))}
          </div>

          <button className='mt-8 px-6 py-2 border-2 border-primary text-primary rounded-full font-bold text-[13px] hover:bg-primary hover:text-white transition-colors cursor-pointer'>
            Leave Us A Review
          </button>
        </div>

      </div>
    </div>
  )
}
