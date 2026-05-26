import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../api/product.api'
import { getCategories } from '../../api/category.api'
import { generateNameId } from '../../utils/utils'

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
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts()
  })
  
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  })

  const products = productsData?.data?.result?.products || []
  const categories = categoriesData?.data?.result || []

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
      </div>

      <div className='mt-12'>
        <div className='flex items-baseline justify-between'>
          <h2 className='text-xl font-extrabold text-slate-900 tracking-tight'>
            Danh mục sản phẩm
          </h2>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-5 gap-6 mt-6'>
          <div
            onClick={() => navigate('/products')}
            className={`border rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md bg-white border-slate-200/60 text-slate-800`}
          >
            <div className='w-12 h-12 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center text-xl mx-auto shadow-sm'>
              📦
            </div>
            <h3 className='font-bold text-xs mt-3 uppercase tracking-wider'>Tất cả</h3>
          </div>
          
          {categories.map((cat: any, idx: number) => {
            return (
              <div
                key={idx}
                onClick={() => navigate(`/products?category=${cat._id}`)}
                className={`border rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md bg-white border-slate-200/60 text-slate-800`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto shadow-md overflow-hidden bg-white`}>
                  <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                </div>
                
                <h3 className='font-bold text-xs mt-3 uppercase tracking-wider'>{cat.name}</h3>
              </div>
            )
          })}
        </div>

      <div className='mt-12 space-y-16'>
          <div className='mt-8'>
            <div className='flex gap-6 border-b border-slate-200 pb-3 mb-6'>
              <h2 className='font-bold text-lg uppercase border-b-2 border-blue-600 pb-3 -mb-3 text-slate-900'>
                Sản phẩm nổi bật
              </h2>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
              <div className='flex-1 grid grid-cols-2 md:grid-cols-5 gap-4'>
                {products.map((product: any) => (
                    <Link 
                      key={product._id} 
                      to={`/product/${generateNameId({ name: product.name, id: product._id })}`}
                      className='bg-white rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100/80 group block text-inherit no-underline'
                    >
                      <div>
                        <div className='flex items-center gap-1 text-[9px] font-bold'>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.quantity > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className={product.quantity > 0 ? 'text-emerald-600' : 'text-rose-500'}>
                            {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
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
                                className={`w-3 h-3 fill-current ${i < Math.floor(product.rating || 5) ? 'text-amber-400' : 'text-slate-200'}`} 
                                viewBox='0 0 20 20'
                              >
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                              </svg>
                            ))}
                          </div>
                          <span className='text-[9px] text-slate-400 font-semibold'>
                            Đã bán: {product.sold || 0}
                          </span>
                        </div>

                        <h3 className='text-xs font-bold text-slate-700 mt-2 leading-snug line-clamp-2 min-h-[32px] hover:text-blue-600 transition-colors'>
                          {product.name}
                        </h3>
                      </div>

                      <div className='mt-4 pt-2 border-t border-slate-50'>
                        {product.price_before_discount && (
                          <span className='text-[10px] line-through text-slate-400 block'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price_before_discount)}
                          </span>
                        )}
                        <div className='text-sm font-black text-rose-600'>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}
