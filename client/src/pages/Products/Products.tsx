import { useState, useMemo } from 'react'
import { useSearchParams, Link, useParams, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts } from '../../api/product.api'
import { getCategories } from '../../api/category.api'
import { addToCart } from '../../api/purchase.api'
import { toast } from 'react-toastify'
import { generateNameId, getIdFromNameId } from '../../utils/utils'


export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const queryClient = useQueryClient()

  // 1. Get filters from URL Search Params
  const categoryFilter = searchParams.get('category') || categorySlug || 'All'
  const categoryId = categoryFilter !== 'All' ? getIdFromNameId(categoryFilter) : 'All'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sortBy = searchParams.get('sort') || 'newest'
  const searchFilter = searchParams.get('search') || ''
  const page = searchParams.get('page') || '1'

  // Input states for price filter (so it doesn't trigger URL updates on every keystroke)
  const [priceInput, setPriceInput] = useState({
    min: minPrice,
    max: maxPrice
  })

  // Apply Price Filters
  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    if (priceInput.min) {
      newParams.set('minPrice', priceInput.min)
    } else {
      newParams.delete('minPrice')
    }
    if (priceInput.max) {
      newParams.set('maxPrice', priceInput.max)
    } else {
      newParams.delete('maxPrice')
    }
    newParams.set('page', '1') // Reset page on filter change
    setSearchParams(newParams)
  }

  // Update a single filter helper
  const updateFilter = (key: string, value: string) => {
    if (key === 'category') {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('page', '1')
      if (value === 'All') {
        newParams.delete('category')
      } else {
        newParams.set('category', value)
      }
      navigate({ pathname: '/products', search: newParams.toString() })
      return
    }

    const newParams = new URLSearchParams(searchParams)
    if (value === 'All' || !value) {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    if (key !== 'page') {
      newParams.set('page', '1') // Reset page on filter change
    }
    setSearchParams(newParams)
  }

  const clearAllFilters = () => {
    setPriceInput({ min: '', max: '' })
    if (categorySlug || searchParams.get('category')) {
      navigate('/products')
    } else {
      setSearchParams(new URLSearchParams())
    }
  }

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  })
  const categories = categoriesData?.data?.result || []

  // Find Category Name for Display
    const currentCategoryName = useMemo(() => {
    if (categoryFilter === 'All') return 'Full Hardware Store'
    const cat = categories.find((c: any) => c._id === categoryId) // Đổi thành categoryId
    return cat ? cat.name : categoryFilter
  }, [categoryFilter, categories, categoryId]) // Thêm categoryId vào dependency list


  // Fetch Products
  const queryConfig = {
    category: categoryId !== 'All' ? categoryId : undefined,
    search: searchFilter || undefined,
    price_min: minPrice || undefined,
    price_max: maxPrice || undefined,
    sort: sortBy,
    page: page,
    limit: 12
  }

  const { data: productsData, isFetching } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => getProducts(queryConfig)
  })

  const products = productsData?.data?.result?.products || []
  const pagination = productsData?.data?.result?.pagination || { page: 1, limit: 12, page_size: 1, total_items: 0 }

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

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate(productId)
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans p-6'>

      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center gap-1.5 text-xs text-dark opacity-70 mb-4'>
          <Link to='/' className='hover:text-primary transition'>Home</Link>
          <span className='opacity-50'>›</span>
          <Link to='/products' className='hover:text-primary transition'>Products</Link>
          {categoryFilter !== 'All' && (
            <>
              <span className='opacity-50'>›</span>
              <span className='font-medium text-dark'>{currentCategoryName}</span>
            </>
          )}
        </div>
        <h1 className='text-3xl font-bold text-dark mb-6'>
          {currentCategoryName} <span className='text-gray-400 font-medium text-xl'>({pagination.total_items})</span>
        </h1>
      </div>

      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-8'>
        <aside className='w-full lg:w-[240px] flex-shrink-0'>
          <button onClick={() => navigate(-1)} className='flex items-center gap-1 text-xs font-semibold text-dark mb-4 hover:text-primary transition-colors'>
            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'/></svg>
            Back
          </button>

          <div className='bg-white pt-2'>
            <h2 className='text-sm font-bold text-dark text-center mb-4'>Filters</h2>
            <button
              onClick={clearAllFilters}
              className='w-full py-2.5 px-4 mb-6 border border-gray-300 rounded-full text-xs font-semibold text-gray-500 hover:text-dark hover:border-gray-400 transition-colors cursor-pointer'
            >
              Clear Filter
            </button>

            {/* Category Accordion */}
            <div className='border-b border-gray-200 pb-4 mb-4'>
              <div className='flex items-center justify-between cursor-pointer mb-4'>
                <h3 className='text-xs font-bold text-dark'>Category</h3>
                <svg className='w-3 h-3 text-dark' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 15l7-7 7 7'/></svg>
              </div>
              <div className='space-y-3'>
                {categories.slice(0, 5).map((cat: any) => (
                  <div 
                    key={cat._id}
                    onClick={() => updateFilter('category', generateNameId({ name: cat.name, id: cat._id }))}
                    className={`flex items-center justify-between text-xs cursor-pointer ${categoryFilter === generateNameId({ name: cat.name, id: cat._id }) ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary transition-colors'}`}
                  >
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Accordion */}
            <div className='border-b border-gray-200 pb-4 mb-4'>
              <div className='flex items-center justify-between cursor-pointer mb-4'>
                <h3 className='text-xs font-bold text-dark'>Price</h3>
                <svg className='w-3 h-3 text-dark' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 15l7-7 7 7'/></svg>
              </div>
              <div className='space-y-3'>
                {[
                  { label: '$0.00 - $1,000.00', min: '0', max: '1000' },
                  { label: '$1,000.00 - $2,000.00', min: '1000', max: '2000' },
                  { label: '$2,000.00 - $3,000.00', min: '2000', max: '3000' },
                  { label: '$3,000.00 - $4,000.00', min: '3000', max: '4000' },
                  { label: '$4,000.00 - $5,000.00', min: '4000', max: '5000' },
                  { label: '$5,000.00 - $6,000.00', min: '5000', max: '6000' },
                  { label: '$6,000.00 - $7,000.00', min: '6000', max: '7000' },
                  { label: '$7,000.00 And Above', min: '7000', max: '' }
                ].map((range, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams)
                      if(range.min) newParams.set('minPrice', range.min)
                      else newParams.delete('minPrice')
                      if(range.max) newParams.set('maxPrice', range.max)
                      else newParams.delete('maxPrice')
                      setSearchParams(newParams)
                    }}
                    className={`flex items-center justify-between text-xs cursor-pointer ${(minPrice === range.min && maxPrice === range.max) ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary transition-colors'}`}
                  >
                    <span>{range.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Accordion */}
            <div className='border-b border-gray-200 pb-4 mb-4'>
              <div className='flex items-center justify-between cursor-pointer mb-4'>
                <h3 className='text-xs font-bold text-dark'>Color</h3>
                <svg className='w-3 h-3 text-dark' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 15l7-7 7 7'/></svg>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 rounded-full bg-black cursor-pointer border-2 border-transparent hover:border-gray-300 transition-colors'></div>
                <div className='w-6 h-6 rounded-full bg-red-600 cursor-pointer border-2 border-primary transition-colors'></div>
              </div>
            </div>

            {/* Filter Name Accordion */}
            <div className='border-b border-gray-200 pb-4 mb-4'>
              <div className='flex items-center justify-between cursor-pointer mb-4'>
                <h3 className='text-xs font-bold text-dark'>Filter Name</h3>
                <svg className='w-3 h-3 text-dark' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 15l7-7 7 7'/></svg>
              </div>
              <button className='w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full text-xs font-bold transition-colors cursor-pointer'>
                Apply Filters (2)
              </button>
            </div>

            {/* Brands */}
            <div className='pt-2'>
              <h3 className='text-sm font-bold text-dark text-center mb-4'>Brands</h3>
              <button className='w-full py-2.5 mb-6 border border-gray-300 rounded-full text-xs font-semibold text-gray-500 hover:text-dark hover:border-gray-400 transition-colors cursor-pointer'>
                All Brands
              </button>
            </div>
            
            {/* Compare Products & Wish List Box */}
            <div className='bg-secondary rounded-lg p-5 text-center mt-6'>
              <h3 className='text-xs font-bold text-dark mb-3'>Compare Products</h3>
              <p className='text-xs text-gray-500'>You have no items to compare.</p>
            </div>
            <div className='bg-secondary rounded-lg p-5 text-center mt-4'>
              <h3 className='text-xs font-bold text-dark mb-3'>My Wish List</h3>
              <p className='text-xs text-gray-500'>You have no items in your wish list.</p>
            </div>
          </div>
        </aside>

        <main className='flex-1'>

          <div className='bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-6'>
            <div className='text-xs font-bold text-slate-500 flex items-center gap-2'>
              {isFetching ? (
                <div className='animate-pulse w-32 h-4 bg-slate-200 rounded' />
              ) : (
                <>
                  Showing <span className='text-slate-900'>{pagination.total_items}</span> products matching your criteria
                </>
              )}
            </div>

            <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
              <div className='flex items-center gap-2'>
                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => updateFilter('sort', e.target.value)}
                  className='bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-1.5 px-3 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer transition'
                >
                  <option value='newest'>Newest Arrivals</option>
                  <option value='price_asc'>Price: Low to High</option>
                  <option value='price_desc'>Price: High to Low</option>
                  <option value='top_sales'>Top Sales</option>
                </select>
              </div>

              <div className='flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/30'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  title='Grid View'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  title='List View'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M4 6h16M4 12h16M4 18h16' />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {!isFetching && products.length === 0 && (
            <div className='bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm'>
              <div className='w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm animate-pulse mb-4'>
                🔎
              </div>
              <h3 className='text-sm font-extrabold uppercase text-slate-800 tracking-wider'>No Products Found</h3>
              <p className='text-slate-400 font-medium text-xs max-w-sm mx-auto mt-2 leading-relaxed'>
                We couldn't find any products matching those filters. Try relaxing your price filters or checking other categories!
              </p>
              <button
                onClick={clearAllFilters}
                className='mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer uppercase tracking-wider shadow-md shadow-blue-100 hover:shadow'
              >
                Clear All Filters
              </button>
            </div>
          )}

          {viewMode === 'grid' ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
              {products.map((product: any) => {
                const inStock = product.quantity > 0
                return (
                  <Link to={`/product/${generateNameId({ name: product.name, id: product._id })}`}
                    key={product._id}
                    className='bg-white p-4 flex flex-col justify-between border-r border-b border-gray-200 hover:shadow-xl transition-all duration-300 group relative'
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
                          handleAddToCart(product._id)
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
          ) : (
            <div className='space-y-4'>
              {products.map((product: any) => {
                const inStock = product.quantity > 0;
                return (
                  <Link
                    key={product._id}
                    to={`/${categorySlug || categories.find((c: any) => c._id === product.category_id)?.slug || 'products'}/${product.slug}`}
                    className='bg-white p-6 border-b border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-8 group relative no-underline block'
                  >

                    <div className='w-full sm:w-[220px] h-[160px] flex items-center justify-center p-4 relative flex-shrink-0'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 select-none'
                      />
                    </div>

                    <div className='flex-1 min-w-0 w-full'>
                      <div className='flex items-center gap-3 select-none mb-2'>
                        <div className='flex items-center gap-1.5 text-[10px] font-semibold'>
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
                      </div>

                      <h3 className='text-sm font-semibold text-dark leading-snug hover:text-primary transition-colors mb-2'>
                        {product.name}
                      </h3>

                      <div className='flex items-center gap-2 mb-3'>
                        <div className='flex text-[#E9A426]'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-3.5 h-3.5 fill-current ${i < Math.floor(product.rating || 5) ? 'text-[#E9A426]' : 'text-gray-200'}`} viewBox='0 0 20 20'>
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                          ))}
                        </div>
                        <span className='text-[11px] text-gray-400'>Reviews ({product.sold || 4})</span>
                      </div>

                      <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed max-w-2xl'>
                        {product.description}
                      </p>
                    </div>

                    <div className='w-full sm:w-[150px] flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-4 flex-shrink-0'>
                      <div>
                        {product.price_before_discount && (
                          <span className='text-[12px] line-through text-gray-400 block leading-none select-none mb-1'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price_before_discount)}
                          </span>
                        )}
                        <div className='text-[20px] font-bold text-dark leading-none'>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          handleAddToCart(product._id)
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        disabled={!inStock}
                        className={`h-10 px-6 w-full rounded-full flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer select-none ${inStock
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                        </svg>
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {pagination.page_size > 1 && (
            <div className='flex items-center justify-center gap-2 mt-12 mb-6 select-none'>
              <button
                onClick={() => updateFilter('page', String(Math.max(1, pagination.page - 1)))}
                disabled={pagination.page === 1}
                className='w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition cursor-pointer text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed'
              >
                «
              </button>
              {Array.from({ length: pagination.page_size }).map((_, idx) => {
                const pageNum = idx + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilter('page', String(pageNum))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition cursor-pointer ${pagination.page === pageNum
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-blue-600 hover:text-white'
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => updateFilter('page', String(Math.min(pagination.page_size, pagination.page + 1)))}
                disabled={pagination.page === pagination.page_size}
                className='w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition cursor-pointer text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed'
              >
                »
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
