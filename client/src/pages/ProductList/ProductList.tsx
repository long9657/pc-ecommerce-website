import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts } from '../../api/product.api'
import { getCategories } from '../../api/category.api'
import { addToCart } from '../../api/purchase.api'
import { generateNameId } from '../../utils/utils'
import { toast } from 'react-toastify'

const MOCK_HERO_SLIDES = [
  {
    id: 1,
    title: 'KHÁM PHÁ CÔNG NGHỆ MỚI',
    subtitle: 'MỞ BÁN SẢN PHẨM MỚI',
    description: 'Trải nghiệm những sản phẩm công nghệ đỉnh cao với mức giá ưu đãi nhất thị trường.',
    image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=1200',
    themeColor: 'rgb(220, 38, 38)',
    ctaText: 'Mua Ngay'
  }
]

export default function ProductList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentHeroSlide = 0

  const [activeTab, setActiveTab] = useState<string>('all')

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts()
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
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
  const categories = categoriesData?.data?.result || []

  return (
    <div className='p-6 bg-slate-100 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <div className='relative w-full h-[400px] md:h-[500px] rounded-sm overflow-hidden mb-12 bg-black'>
          <div
            className='absolute inset-0 w-full h-full flex flex-col justify-center bg-cover bg-center'
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9) 10%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%), url(${MOCK_HERO_SLIDES[currentHeroSlide].image})`
            }}
          >
            <div className='max-w-xl px-12 md:px-20 text-white z-10'>
              <h1 className='text-4xl md:text-5xl font-light mb-4 font-sans tracking-tight'>
                Outplay the <br /><span className='font-bold'>Competition</span>
              </h1>
              <p className='text-gray-300 text-sm md:text-base mb-8 max-w-sm'>
                Experience the power of the new MSI gear and dominate your game like never before.
              </p>
              <button
                onClick={() => navigate('/products')}
                className='px-8 py-3 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors cursor-pointer'
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

        <div className='mb-12'>
          <div className='flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap pb-2'>
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${activeTab === 'all' ? 'border-primary text-dark' : 'border-transparent text-gray-400 hover:text-dark'}`}
            >
              New Products
            </button>
            {categories.slice(0, 4).map((cat: any) => (
              <button
                key={cat._id}
                onClick={() => setActiveTab(cat._id)}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${activeTab === cat._id ? 'border-primary text-dark' : 'border-transparent text-gray-400 hover:text-dark'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className='flex-1 grid grid-cols-2 md:grid-cols-5 gap-4'>
            {products
              .filter((product: any) => activeTab === 'all' || product.category_id === activeTab)
              .slice(0, 10)
              .map((product: any) => {
              const inStock = product.quantity > 0;
              return (
                <Link to={`/product/${generateNameId({ name: product.name, id: product._id })}`}
                  key={product._id}
                  className='bg-white p-4 flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-all duration-300 group relative'
                >
                  <div>
                    <div className='flex items-center gap-1.5 text-[10px] font-semibold mb-2'>
                      {inStock ? (
                        <>
                          <svg className='w-3 h-3 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/></svg>
                          <span className='text-green-500'>in stock</span>
                        </>
                      ) : (
                        <>
                          <svg className='w-3 h-3 text-red-500' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd'/></svg>
                          <span className='text-red-500'>out of stock</span>
                        </>
                      )}
                    </div>
                    
                    <div className='h-40 my-4 flex items-center justify-center relative overflow-hidden px-4'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out select-none'
                      />
                    </div>

                    <div className='flex items-center gap-2 mb-2'>
                      <div className='flex text-[#E9A426]'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 fill-current ${i < Math.floor(product.rating || 5) ? 'text-[#E9A426]' : 'text-gray-200'}`} viewBox='0 0 20 20'>
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                      <span className='text-[11px] text-gray-400'>Reviews ({product.sold || 4})</span>
                    </div>

                    <h3 className='text-xs font-semibold text-dark leading-relaxed hover:text-primary transition-colors line-clamp-3 min-h-[50px]'>
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className='pt-3 mt-auto relative'>
                    {product.price_before_discount && (
                      <span className='text-[12px] line-through text-gray-400 block leading-none select-none mb-1'>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price_before_discount)}
                      </span>
                    )}
                    <div className='text-[18px] font-bold text-dark leading-none'>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addToCartMutation.mutate(product._id)
                      }}
                      disabled={!inStock}
                      className={`absolute right-0 bottom-0 h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer select-none opacity-0 group-hover:opacity-100 ${inStock ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      title={inStock ? 'Add to Cart' : 'Out of Stock'}
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' /></svg>
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Brand Logos */}
        <div className='flex flex-wrap items-center justify-between gap-6 py-12 border-t border-gray-200 mt-12 opacity-50 grayscale hover:grayscale-0 transition-all'>
          {['Roccat', 'MSI', 'Razer', 'Thermaltake', 'ADATA', 'HP', 'Gigabyte'].map(brand => (
            <div key={brand} onClick={() => navigate('/products')} className='text-2xl font-black text-gray-400 cursor-pointer hover:text-dark transition-colors uppercase'>
              {brand}
            </div>
          ))}
        </div>

        {/* Instagram/News Section */}
        <div className='mt-12 mb-12'>
          <h2 className='text-center text-xl font-bold text-dark mb-2'>Follow us on Instagram for News, Offers & More</h2>
          <p className='text-center text-sm text-gray-500 mb-8 max-w-lg mx-auto'>
            Stay up to date with the latest gaming hardware drops and exclusive community discounts!
          </p>
          <div className='grid grid-cols-2 md:grid-cols-6 gap-2'>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className='aspect-square bg-gray-200 rounded-sm overflow-hidden'>
                <img 
                  src={`https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=300&h=300&sig=${i}`} 
                  alt='Instagram post'
                  className='w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer'
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
