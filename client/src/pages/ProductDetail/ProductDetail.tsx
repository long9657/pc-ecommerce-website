import { Link, useNavigate, useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductDetail } from '../../api/product.api'
import { addToCart } from '../../api/purchase.api'
import { toast } from 'react-toastify'

import { getIdFromNameId } from '../../utils/utils'

export default function ProductDetail() {
    const { categorySlug, productSlug } = useParams()
    const navigate = useNavigate()

    const id = getIdFromNameId(productSlug as string)

    const { data, isLoading } = useQuery({
      queryKey: ['product', id],
      queryFn: () => getProductDetail(id)
    })

    const queryClient = useQueryClient()
    const addToCartMutation = useMutation({
      mutationFn: () => addToCart({ product_id: product?._id as string, buy_count: 1 }),
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

    const product = data?.data?.result

    if (isLoading) {
      return <div className="min-h-[60vh] flex items-center justify-center text-xl">Đang tải dữ liệu...</div>
    }

    if (!product) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in'>
                <div className='text-6xl mb-4'>🔍</div>
                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Không tìm thấy sản phẩm</h2>
                <button
                onClick={() => navigate('/')}
                className='bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition shadow-sm hover:shadow-md cursor-pointer mt-4'
                >
                Về trang chủ
                </button>
            </div>
        )
    }

    return (
        <div className='max-w-7xl mx-auto px-4 py-8 font-sans animate-fade-in'>
          <nav className='flex items-center gap-1.5 text-xs text-dark opacity-70 mb-8'>
            <Link to='/' className='hover:text-primary transition'>Home</Link>
            <span className='opacity-50'>›</span>
            <Link to={`/${categorySlug}`} className='hover:text-primary transition capitalize'>{categorySlug?.replace(/-/g, ' ')}</Link>
            <span className='opacity-50'>›</span>
            <span className='font-medium text-dark truncate'>{product.name}</span>
          </nav>

          {/* Top navigation tabs (mock) */}
          <div className='flex items-center gap-8 border-b border-gray-200 mb-8 pb-4 text-sm font-semibold'>
            <span className='text-dark border-b-2 border-primary pb-4 -mb-[18px] cursor-pointer'>About Product</span>
            <span className='text-gray-400 hover:text-dark cursor-pointer'>Details</span>
            <span className='text-gray-400 hover:text-dark cursor-pointer'>Specs</span>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16'>
            {/* Left Column: Title, Price, Action */}
            <div className='lg:col-span-5 flex flex-col'>
              <h1 className='text-3xl font-light text-dark leading-tight mb-4'>
                {product.name}
              </h1>
              
              <Link to='#' className='text-primary text-xs font-semibold mb-6 hover:underline'>
                Be the first to review this product
              </Link>

              <div className='text-gray-500 text-sm mb-6 leading-relaxed'>
                {product.description || 'MSI MPG Trident 3 is the most compact gaming desktop. Packaged in a 4.7 liters volume case, it has components that are usually found in full tower cases.'}
              </div>

              {/* Color dots (mock) */}
              <div className='flex items-center gap-2 mb-6'>
                <div className='w-6 h-6 rounded-full bg-black cursor-pointer border-2 border-transparent hover:border-gray-300 transition-colors'></div>
                <div className='w-6 h-6 rounded-full bg-gray-200 cursor-pointer border-2 border-transparent hover:border-gray-400 transition-colors'></div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className='flex items-center gap-4 mb-6 mt-auto'>
                <div className='bg-gray-100 rounded-full px-4 py-2 text-sm font-bold text-dark w-24 flex justify-between items-center select-none'>
                  <span className='text-gray-400 cursor-pointer hover:text-dark'>-</span>
                  <span>1</span>
                  <span className='text-gray-400 cursor-pointer hover:text-dark'>+</span>
                </div>
                <button 
                  onClick={() => addToCartMutation.mutate()}
                  disabled={product.quantity <= 0}
                  className={`flex-1 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                      product.quantity > 0 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
                <button className='w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 cursor-pointer'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'><path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'/></svg>
                </button>
              </div>

              {/* Support links */}
              <div className='flex items-center justify-between text-xs font-semibold text-gray-400 pt-6 border-t border-gray-200'>
                <div className='flex items-center gap-2 cursor-pointer hover:text-dark'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/></svg>
                  Email
                </div>
                <div className='flex items-center gap-2 cursor-pointer hover:text-dark'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/></svg>
                  Compare
                </div>
              </div>
            </div>

            {/* Right Column: Image and Gallery */}
            <div className='lg:col-span-7 flex gap-4'>
              {/* Vertical Thumbnails */}
              <div className='flex flex-col gap-2 w-20 flex-shrink-0'>
                {[1, 2, 3].map(i => (
                  <div key={i} className='w-full aspect-square border border-gray-200 rounded-md p-2 cursor-pointer hover:border-primary'>
                    <img src={product.image} className='w-full h-full object-contain' alt='' />
                  </div>
                ))}
              </div>
              {/* Main Image */}
              <div className='flex-1 border border-gray-200 rounded-lg p-12 flex items-center justify-center relative group'>
                 <div className='absolute top-6 left-6 text-[10px] font-bold text-gray-400'>
                    {product.price_before_discount && (
                      <span className='line-through block mb-1 text-xs'>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price_before_discount)}
                      </span>
                    )}
                    <span className='text-3xl text-dark'>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                 </div>
                 <img 
                  src={product.image} 
                  alt={product.name}
                  className='max-h-[400px] object-contain group-hover:scale-105 transition-transform duration-500'
                 />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className='bg-black w-full text-white py-20 px-8 rounded-lg flex flex-col items-center text-center'>
            <h2 className='text-4xl md:text-5xl font-light mb-8'>Outplay the Competition</h2>
            <p className='max-w-2xl text-sm text-gray-400 mb-16'>
              Experience a 40% boost in computing from last generation. MSI Desktop equips the 10th Gen. Intel® Core™ i7 processor with the upmost computing power to bring you an unparalleled gaming experience.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl'>
              <div className='flex flex-col items-center'>
                <div className='w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4'>
                   <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>
                </div>
                <h3 className='font-bold mb-2'>Intel Core i7</h3>
                <p className='text-xs text-gray-400'>Processor</p>
              </div>
              <div className='flex flex-col items-center'>
                <div className='w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4'>
                   <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'/></svg>
                </div>
                <h3 className='font-bold mb-2'>RTX 3080</h3>
                <p className='text-xs text-gray-400'>Graphics</p>
              </div>
              <div className='flex flex-col items-center'>
                <div className='w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4'>
                   <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>
                </div>
                <h3 className='font-bold mb-2'>1TB SSD</h3>
                <p className='text-xs text-gray-400'>Storage</p>
              </div>
            </div>
          </div>

        </div>
    )
}
