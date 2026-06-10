import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductDetail } from '../../api/product.api'
import { addToCart } from '../../api/purchase.api'
import { getReviews, createReview } from '../../api/review.api'
import { toast } from 'react-toastify'

import { getIdFromNameId } from '../../utils/utils'

const OUTPLAY_SLIDES = [
  {
    title: 'Outplay the\nCompetition',
    desc: 'Experience a 40% boost in computing from last generation. MSI Desktop equips the 10th Gen. Intel® Core™ i7 processor with the upmost computing power to bring you an unparalleled gaming experience.',
    note: '*Performance compared to i7-9700. Specs varies by model.',
    label: 'CORE i7',
    subLabel: '10TH GEN',
    icon: <svg className='w-16 h-16 text-blue-400 mb-4 z-10' fill='currentColor' viewBox='0 0 24 24'><path d='M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v16h16V4H4zm4 4h8v8H8V8zm2 2v4h4v-4h-4z'/></svg>,
    colorFrom: 'from-blue-900',
    colorBorder: 'border-blue-500/30',
    colorShadow: 'shadow-[0_0_50px_rgba(0,100,255,0.2)]',
    colorText: 'text-blue-300',
    colorGlow: 'bg-blue-500'
  },
  {
    title: 'Ultimate\nCooling',
    desc: 'Keep your system running at peak performance with MSI’s exclusive cooling technology. Engineered for high-end processors to sustain boost clocks for longer periods without thermal throttling.',
    note: '*Actual temperatures may vary based on environment.',
    label: 'FROZR',
    subLabel: 'THERMAL',
    icon: <svg className='w-16 h-16 text-cyan-400 mb-4 z-10' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>,
    colorFrom: 'from-cyan-900',
    colorBorder: 'border-cyan-500/30',
    colorShadow: 'shadow-[0_0_50px_rgba(0,255,255,0.2)]',
    colorText: 'text-cyan-300',
    colorGlow: 'bg-cyan-500'
  },
  {
    title: 'Lightning\nFast',
    desc: 'Gen4 PCIe delivers unprecedented data transfer speeds. Load your favorite games in seconds and eliminate bottlenecks for a perfectly smooth gaming experience.',
    note: '*Requires compatible Gen4 NVMe SSD.',
    label: 'GEN 4',
    subLabel: 'PCIe SSD',
    icon: <svg className='w-16 h-16 text-purple-400 mb-4 z-10' fill='currentColor' viewBox='0 0 24 24'><path d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>,
    colorFrom: 'from-purple-900',
    colorBorder: 'border-purple-500/30',
    colorShadow: 'shadow-[0_0_50px_rgba(160,32,240,0.2)]',
    colorText: 'text-purple-300',
    colorGlow: 'bg-purple-500'
  }
]

export default function ProductDetail() {
    const { categorySlug, productSlug } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'about' | 'details' | 'specs' | 'reviews'>('about')
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [buyCount, setBuyCount] = useState(1)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [rating, setRating] = useState(5)
    const [reviewText, setReviewText] = useState('')
    const [activeColor, setActiveColor] = useState(0)
    const [outplayIndex, setOutplayIndex] = useState(0)

    const id = getIdFromNameId(productSlug as string)

    const id = getIdFromNameId(productSlug as string)

    const { data, isLoading } = useQuery({
      queryKey: ['product', id],
      queryFn: () => getProductDetail(id)
    })

    const queryClient = useQueryClient()
    const addToCartMutation = useMutation({
      mutationFn: () => addToCart({ product_id: product?._id as string, buy_count: buyCount }),
      onSuccess: () => {
        toast.success('Added product to cart!')
        queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
      },
      onError: (error: any) => {
        if (error.response?.status === 422 || error.response?.status === 401) {
          toast.error('Please login to add to cart!')
        } else {
          toast.error('An error occurred while adding to cart!')
        }
      }
    })

    const { data: reviewsData } = useQuery({
      queryKey: ['reviews', id],
      queryFn: () => getReviews(id)
    })
    const reviews = reviewsData?.data?.result || []

    const addReviewMutation = useMutation({
      mutationFn: (body: { rating: number; text: string }) => createReview(id, body),
      onSuccess: () => {
        toast.success('Review submitted successfully!')
        queryClient.invalidateQueries({ queryKey: ['reviews', id] })
        queryClient.invalidateQueries({ queryKey: ['product', id] })
        setShowReviewForm(false)
        setReviewText('')
        setRating(5)
      },
      onError: (error: any) => {
        if (error.response?.status === 401) {
          toast.error('Please login to submit a review!')
        } else {
          toast.error('An error occurred while submitting review!')
        }
      }
    })

    const product = data?.data?.result

    // Reset buy count when product changes
    useEffect(() => {
      setBuyCount(1)
    }, [product])

    // Scroll to top when tab changes to ensure subheader isn't missed
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [activeTab])

    // Auto slide for Outplay section
    useEffect(() => {
      if (activeTab === 'about') {
        const timer = setInterval(() => {
          setOutplayIndex(prev => (prev + 1) % OUTPLAY_SLIDES.length)
        }, 4000)
        return () => clearInterval(timer)
      }
    }, [activeTab])

    const handleBuyCountChange = (type: 'increase' | 'decrease') => {
      if (type === 'increase' && buyCount < (product?.quantity || 1)) {
        setBuyCount(prev => prev + 1)
      } else if (type === 'decrease' && buyCount > 1) {
        setBuyCount(prev => prev - 1)
      }
    }

    const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault()
      if (!reviewText.trim()) {
        toast.error('Please enter a review')
        return
      }
      addReviewMutation.mutate({ rating, text: reviewText })
    }

    if (isLoading) {
      return <div className="min-h-[60vh] flex items-center justify-center text-xl">Loading data...</div>
    }

    if (!product) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in'>
                <div className='text-6xl mb-4'>🔍</div>
                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Product not found</h2>
                <button
                onClick={() => navigate('/')}
                className='bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition shadow-sm hover:shadow-md cursor-pointer mt-4'
                >
                Back to Home
                </button>
            </div>
        )
    }

    // Formatter
    const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

    return (
        <div className='font-sans animate-fade-in w-full overflow-hidden bg-white'>
          
          {/* SUB-HEADER (Tabs + Actions) */}
          <div className='w-full border-b border-gray-200 bg-white sticky top-0 z-40'>
            <div className='max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center h-auto md:h-20 py-4 md:py-0'>
              
              {/* Left: Tabs */}
              <div className='flex items-center gap-10 h-full w-full md:w-auto overflow-x-auto border-b md:border-b-0 border-gray-100 mb-4 md:mb-0'>
                <div 
                  onClick={() => setActiveTab('about')}
                  className={`h-full flex items-center whitespace-nowrap cursor-pointer transition-colors pt-2 md:pt-0 ${activeTab === 'about' ? 'border-b-[3px] border-primary text-dark font-bold' : 'border-b-[3px] border-transparent text-gray-500 font-semibold hover:text-dark'}`}
                >
                  About Product
                </div>
                <div 
                  onClick={() => setActiveTab('details')}
                  className={`h-full flex items-center whitespace-nowrap cursor-pointer transition-colors pt-2 md:pt-0 ${activeTab === 'details' ? 'border-b-[3px] border-primary text-dark font-bold' : 'border-b-[3px] border-transparent text-gray-500 font-semibold hover:text-dark'}`}
                >
                  Details
                </div>
                <div 
                  onClick={() => setActiveTab('specs')}
                  className={`h-full flex items-center whitespace-nowrap cursor-pointer transition-colors pt-2 md:pt-0 ${activeTab === 'specs' ? 'border-b-[3px] border-primary text-dark font-bold' : 'border-b-[3px] border-transparent text-gray-500 font-semibold hover:text-dark'}`}
                >
                  Specs
                </div>
                <div 
                  onClick={() => setActiveTab('reviews')}
                  className={`h-full flex items-center whitespace-nowrap cursor-pointer transition-colors pt-2 md:pt-0 ${activeTab === 'reviews' ? 'border-b-[3px] border-primary text-dark font-bold' : 'border-b-[3px] border-transparent text-gray-500 font-semibold hover:text-dark'}`}
                >
                  Reviews
                </div>
              </div>

              {/* Right: Actions */}
              <div className='flex items-center gap-3 md:gap-5 w-full md:w-auto justify-between md:justify-end'>
                <div className='text-[13px] text-gray-600 hidden lg:block whitespace-nowrap'>
                  On Sale from <span className='font-bold text-dark text-[15px] ml-1'>{formatPrice(product.price)}</span>
                </div>
                
                <div className='flex items-center gap-2'>
                  <div className='bg-slate-50 border border-gray-200 rounded px-3 py-2 flex items-center text-sm font-bold text-dark w-[60px] justify-between'>
                    <span className='w-4 text-center'>{buyCount}</span>
                    <div className='flex flex-col text-[10px] text-gray-400 ml-2'>
                      <span onClick={() => handleBuyCountChange('increase')} className='cursor-pointer hover:text-dark leading-none'>▲</span>
                      <span onClick={() => handleBuyCountChange('decrease')} className='cursor-pointer hover:text-dark leading-none'>▼</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCartMutation.mutate()}
                    disabled={product.quantity <= 0}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                        product.quantity > 0 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                  <button className='px-6 py-2.5 bg-[#FFC439] hover:bg-[#F2BA36] rounded-full flex items-center justify-center transition-colors cursor-pointer hidden sm:flex'>
                    <svg className='h-4' viewBox="0 0 200 53" fill="none"><path fill="#003087" d="M25.1 0h-16c-.7 0-1.2.5-1.3 1.2l-7.3 46.1c-.1.5.3 1 .8 1h7.8c.7 0 1.2-.5 1.3-1.2l1.6-10.2h8.3c8.9 0 13.9-4.3 15-12.7.5-3.3.1-6.2-1-8.5-2.2-5-7.5-7.9-15.6-7.9h-3.6zm-4.7 20.3h-4.3l2.2-14.3h4.3c4 0 6.6 1.1 7.2 4.2.3 1.8.1 4.1-1.4 6.3-1.4 2-3.8 3.8-8 3.8z"/><path fill="#009CDE" d="M68.7 18.2c-1.3-2.3-4.3-3.8-8.8-3.8h-11.8c-.7 0-1.2.5-1.3 1.2l-7.2 45.4c-.1.5.3 1 .8 1h7.3c.7 0 1.2-.5 1.3-1.2l1.6-9.9h7.3c7.7 0 12.3-3.7 13.4-11 .5-3.2.1-6.1-1-8.5-1.6-5.5-6.3-8.8-11.6-13.2zm-4.6 20.3h-4.3l2.2-14.3h4.3c4 0 6.6 1.1 7.2 4.2.3 1.8.1 4.1-1.4 6.3-1.4 2-3.8 3.8-8 3.8z"/><path fill="#012169" d="M96 15l-10.8 32.5c-.2.6-.7 1-1.3 1H76.3c-.6 0-.9-.6-.7-1.1l5.4-15.3-7.5-16c-.3-.7.2-1.3.8-1.3h8.2c.5 0 .9.3 1.1.7l3.8 9.5 4.5-9.5c.2-.5.7-.7 1.2-.7h8c.6-.1 1 .5.7 1.2z"/></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* TAB CONTENT: ABOUT */}
          {activeTab === 'about' && (
            <div className='animate-fade-in'>
              {/* HERO SPLIT SECTION */}
              <div className='flex flex-col lg:flex-row w-full lg:min-h-[600px]'>
                
                {/* Left Side (Grey background) */}
                <div className='w-full lg:w-1/2 bg-[#F5F7FF] flex justify-center lg:justify-end pt-12 pb-20 px-6 lg:px-0'>
                  <div className='w-full max-w-[550px] lg:pr-16 flex flex-col'>
                    
                    <nav className='flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold mb-12 tracking-wide uppercase'>
                      <Link to='/' className='hover:text-primary transition'>Home</Link>
                      <span className='opacity-50 mx-1'>›</span>
                      <Link to={`/${categorySlug}`} className='hover:text-primary transition'>{categorySlug?.replace(/-/g, ' ')}</Link>
                      <span className='opacity-50 mx-1'>›</span>
                      <span className='text-gray-400 truncate max-w-[200px]'>{product.name}</span>
                    </nav>

                    <h1 className='text-4xl lg:text-[42px] font-light text-dark leading-tight mb-3'>
                      {product.name}
                    </h1>
                    
                    <div className='flex items-center gap-2 mb-8'>
                      <div className='flex text-[#E9A426]'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 fill-current ${i < Math.floor(product.rating || 5) ? 'text-[#E9A426]' : 'text-gray-200'}`} viewBox='0 0 20 20'>
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                      <span className='text-gray-400 text-[11px] font-semibold'>{product.rating || 5}.0</span>
                      <span className='text-gray-300 text-[11px] mx-1'>|</span>
                      <span 
                        onClick={() => setActiveTab('reviews')}
                        className='text-primary text-[12px] font-semibold cursor-pointer hover:underline'
                      >
                        {product.sold || 4} Reviews
                      </span>
                    </div>

                    <p className='text-sm text-gray-500 leading-relaxed mb-8'>
                      {product.description || `${product.name} - High quality PC component featuring excellent performance and reliability. Upgrade your system with this premium hardware.`}
                    </p>

                    {product.color && (
                      <div className='flex flex-col gap-2 mb-12'>
                        <span className='text-xs font-bold text-dark uppercase tracking-wider'>Color: <span className='text-gray-500 font-medium capitalize'>{product.color}</span></span>
                        <div className='flex items-center gap-4'>
                          <div 
                            className={`w-8 h-8 rounded-full cursor-pointer transition-all shadow-sm ring-2 ring-offset-2 ring-blue-400 ${
                              product.color === 'red' ? 'bg-red-600' : 
                              product.color === 'silver' ? 'bg-slate-300' : 
                              product.color === 'white' ? 'bg-slate-100' : 'bg-slate-900'
                            }`}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className='flex items-center justify-between text-[13px] font-semibold text-dark max-w-[450px] mb-12'>
                      <div className='flex items-center'>
                        Have a Question? <Link to='/contact' className='text-primary ml-1 hover:underline'>Contact Us</Link>
                      </div>
                      <div className='text-gray-400 font-normal'>
                        SKU: {product._id.slice(-7).toUpperCase()}
                      </div>
                    </div>

                    <div className='mt-auto pt-4 text-[13px] font-bold text-dark flex items-center gap-2 cursor-pointer hover:text-primary transition-colors'>
                      <span>+</span> MORE INFORMATION
                    </div>

                  </div>
                </div>

                {/* Right Side (White background) */}
                <div className='w-full lg:w-1/2 bg-white flex justify-center lg:justify-start relative py-20 px-6 lg:px-0'>
                  <div className='w-full max-w-[650px] lg:pl-16 flex flex-col items-center justify-center relative'>
                    
                    {/* Floating Action Icons */}
                    <div className='absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 hidden md:flex'>
                      <button className='w-10 h-10 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors shadow-sm'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'/></svg>
                      </button>
                      <button className='w-10 h-10 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors shadow-sm'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/></svg>
                      </button>
                      <button className='w-10 h-10 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors shadow-sm'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/></svg>
                      </button>
                    </div>

                    {/* Main Image */}
                    <div className='w-[80%] h-[400px] flex items-center justify-center mb-16'>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className='max-w-full max-h-full object-contain'
                      />
                    </div>

                    {/* Zip Pay Logo */}
                    <div className='flex items-center gap-4 text-[11px] text-gray-500 font-medium'>
                      <div className='flex items-center text-xl font-bold'>
                        <span className='text-blue-500'>z</span><span className='text-purple-500'>i</span><span className='text-orange-500'>p</span>
                      </div>
                      <div className='border-l border-gray-300 pl-4'>
                        own it now, up to 6 months<br/>interest free <Link to='#' className='text-dark underline font-bold'>learn more</Link>
                      </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className='absolute bottom-10 right-10 flex gap-2 hidden md:flex'>
                      <div className='w-2 h-2 rounded-full bg-primary'></div>
                      <div className='w-2 h-2 rounded-full bg-gray-300'></div>
                      <div className='w-2 h-2 rounded-full bg-gray-300'></div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Outplay the Competition Section */}
              <div className='bg-[#0A0A0A] w-full text-white py-24 px-6 md:px-12 overflow-hidden'>
                <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16'>
                  <div className='lg:w-5/12 flex flex-col relative min-h-[250px]'>
                    <div 
                      key={outplayIndex}
                      className='animate-fade-in'
                    >
                      <h2 className='text-4xl md:text-[54px] font-light leading-tight mb-8 whitespace-pre-line'>
                        {OUTPLAY_SLIDES[outplayIndex].title}
                      </h2>
                      <p className='text-[15px] text-gray-300 mb-8 leading-relaxed max-w-[420px] min-h-[80px]'>
                        {OUTPLAY_SLIDES[outplayIndex].desc}
                      </p>
                      <p className='text-[13px] text-gray-500 max-w-[400px]'>
                        {OUTPLAY_SLIDES[outplayIndex].note}
                      </p>
                    </div>
                    
                    {/* Pagination for outplay section */}
                    <div className='flex gap-2 mt-16'>
                      {OUTPLAY_SLIDES.map((_, i) => (
                        <div 
                          key={i} 
                          onClick={() => setOutplayIndex(i)}
                          className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${i === outplayIndex ? 'bg-primary' : 'bg-white/30 hover:bg-white/60'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className='lg:w-7/12 flex justify-center'>
                    <div 
                      key={outplayIndex + 'box'}
                      className={`w-[450px] h-[300px] bg-gradient-to-br ${OUTPLAY_SLIDES[outplayIndex].colorFrom} to-black border ${OUTPLAY_SLIDES[outplayIndex].colorBorder} rounded-xl ${OUTPLAY_SLIDES[outplayIndex].colorShadow} flex flex-col items-center justify-center relative overflow-hidden group animate-fade-in`}
                    >
                       <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+")] opacity-50'></div>
                       {OUTPLAY_SLIDES[outplayIndex].icon}
                       <div className='text-3xl font-bold text-white z-10'>{OUTPLAY_SLIDES[outplayIndex].label}</div>
                       <div className={`${OUTPLAY_SLIDES[outplayIndex].colorText} font-semibold tracking-widest mt-1 z-10`}>{OUTPLAY_SLIDES[outplayIndex].subLabel}</div>
                       <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${OUTPLAY_SLIDES[outplayIndex].colorGlow} rounded-full blur-[80px] opacity-50`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: DETAILS */}
          {activeTab === 'details' && (
            <div className='animate-fade-in max-w-7xl mx-auto px-6 py-16'>
              <div className='bg-white p-10 rounded-2xl border border-gray-100 shadow-sm'>
                <h2 className='text-2xl font-bold text-dark mb-8'>Product Details</h2>
                <div className='prose prose-sm max-w-none text-gray-600'>
                  <p className='mb-8 text-base leading-relaxed'>
                    {product.description || `Experience ultimate performance with the ${product.name}. Featuring top-tier quality, efficient design, and built to handle anything you throw at it. Engineered for enthusiasts, every component has been carefully crafted.`}
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                    <div>
                      <h4 className='font-bold text-dark mb-4 text-lg'>Key Features</h4>
                      <ul className='list-none space-y-3 text-sm'>
                        <li className='flex items-start gap-2'>
                          <svg className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'/></svg>
                          High-performance and optimal efficiency.
                        </li>
                        <li className='flex items-start gap-2'>
                          <svg className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'/></svg>
                          Premium build quality with durable materials.
                        </li>
                        <li className='flex items-start gap-2'>
                          <svg className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'/></svg>
                          Easy installation and upgrade path.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className='font-bold text-dark mb-4 text-lg'>Compatibility</h4>
                      <ul className='list-none space-y-3 text-sm'>
                        <li className='flex items-start gap-2'>
                          <svg className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'/></svg>
                          Universally compatible with modern systems.
                        </li>
                        <li className='flex items-start gap-2'>
                          <svg className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'/></svg>
                          Plug and play setup out of the box.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SPECS */}
          {activeTab === 'specs' && (
            <div className='animate-fade-in max-w-7xl mx-auto px-6 py-16'>
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <table className='w-full text-left text-sm text-gray-600'>
                    <tbody>
                      {Object.entries(product.specs).map(([key, value], index) => (
                        <tr key={index} className='border-b border-gray-100 hover:bg-slate-50 transition-colors'>
                          <th className={`py-5 px-8 font-semibold text-dark w-1/3 ${index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                            {key.replace(/_/g, ' ').toUpperCase()}
                          </th>
                          <td className='py-5 px-8 capitalize'>{String(value) || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className='p-12 text-center text-gray-500'>
                    No specifications available for this product.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className='animate-fade-in max-w-7xl mx-auto px-6 py-16'>
              <div className='bg-white p-10 rounded-2xl border border-gray-100 shadow-sm'>
                <div className='flex items-center justify-between mb-8'>
                  <h2 className='text-2xl font-bold text-dark'>Customer Reviews</h2>
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className='px-6 py-2 border-2 border-primary text-primary rounded-full font-bold text-[13px] hover:bg-primary hover:text-white transition-colors cursor-pointer'
                  >
                    {showReviewForm ? 'Cancel' : 'Write A Review'}
                  </button>
                </div>
                
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className='bg-slate-50 p-6 rounded-xl border border-gray-100 mb-8 animate-fade-in'>
                    <h3 className='font-bold text-dark mb-4 text-lg'>Write your review</h3>
                    <div className='mb-4'>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Rating</label>
                      <div className='flex gap-1 cursor-pointer'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            onClick={() => setRating(star)}
                            className={`w-6 h-6 transition-colors ${star <= rating ? 'text-[#E9A426] fill-current' : 'text-gray-300 fill-current hover:text-[#E9A426]'}`} 
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className='mb-4'>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Review</label>
                      <textarea 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none'
                        rows={4}
                        placeholder='Tell us what you think about this product...'
                      ></textarea>
                    </div>
                    <div className='flex justify-end'>
                      <button type='submit' className='bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-colors'>
                        Submit Review
                      </button>
                    </div>
                  </form>
                )}

                <div className='space-y-8'>
                  {reviews.length === 0 && <div className='text-gray-500 text-sm'>No reviews yet for this product. Be the first to review!</div>}
                  {reviews.map((review: any) => {
                    const userName = review.user?.name || review.user?.email?.split('@')[0] || 'Anonymous'
                    const initials = userName.substring(0, 2).toUpperCase()
                    const date = new Date(review.created_at).toLocaleDateString('en-US')
                    return (
                      <div key={review._id} className='border-b border-gray-100 pb-8 last:border-0 last:pb-0'>
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500'>
                              {initials}
                            </div>
                            <div>
                              <p className='text-[13px] font-bold text-dark'>{userName}</p>
                              <div className='flex text-[#E9A426] mt-1'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg key={i} className={`w-3 h-3 fill-current ${i < review.rating ? 'text-[#E9A426]' : 'text-gray-200'}`} viewBox='0 0 20 20'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className='text-[11px] text-gray-400'>{date}</span>
                        </div>
                        <p className='text-gray-600 text-sm leading-relaxed pl-13'>
                          {review.text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
    )
}
