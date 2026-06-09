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
  const categoryFilter = searchParams.get('category') || 'All'
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
      newParams.delete('category')
      newParams.set('page', '1')
      if (value === 'All') {
        navigate({ pathname: '/products', search: newParams.toString() })
      } else {
        navigate({ pathname: `/${value}`, search: newParams.toString() })
      }
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

      <nav className='max-w-7xl mx-auto flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-6'>
        <Link to='/' className='hover:text-blue-600 transition'>Home</Link>
        <span>/</span>
        <Link to='/products' className='hover:text-blue-600 transition text-slate-600'>Products</Link>
        {categoryFilter !== 'All' && (
          <>
            <span>/</span>
            <span className='text-slate-900 font-black'>{currentCategoryName}</span>
          </>
        )}
      </nav>

      <div className='max-w-7xl mx-auto bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-lg border border-slate-800'>
        <div className='absolute right-0 top-0 w-[50%] h-full opacity-10 bg-radial-gradient from-blue-400 to-transparent pointer-events-none' />
        <div className='max-w-xl text-white relative z-10 select-none'>
          <span className='text-[10px] font-extrabold tracking-widest uppercase bg-blue-600/30 text-blue-400 px-3.5 py-1.5 rounded-full border border-blue-500/20'>
            Products
          </span>
          <h1 className='text-3xl md:text-4xl font-extrabold mt-4 tracking-tight leading-tight uppercase font-sans'>
            {currentCategoryName}
          </h1>
          <p className='text-slate-400 mt-2 text-xs md:text-sm leading-relaxed font-medium opacity-90'>
            Discover raw power and performance components customized for bleeding-edge esports environments. Filter and customize below.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-8'>
        <aside className='w-full lg:w-[260px] flex-shrink-0 space-y-6'>
          <div className='bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm'>
            <div className='flex items-center justify-between border-b border-slate-100 pb-4 mb-4'>
              <h2 className='text-sm font-extrabold text-slate-800 uppercase tracking-wider'>Filters</h2>
              {(categoryFilter !== 'All' || minPrice || maxPrice || searchFilter) && (
                <button
                  onClick={clearAllFilters}
                  className='text-[10px] font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer'
                >
                  Clear All
                </button>
              )}
            </div>

            {(categoryFilter !== 'All' || minPrice || maxPrice || searchFilter) && (
              <div className='flex flex-wrap gap-1.5 mb-6 border-b border-slate-100 pb-4'>
                {categoryFilter !== 'All' && (
                  <span className='inline-flex items-center gap-1 bg-slate-100 text-[10px] font-bold text-slate-600 px-2.5 py-1 rounded-full'>
                    {currentCategoryName}
                    <button onClick={() => updateFilter('category', 'All')} className='hover:text-rose-500 cursor-pointer font-black ml-1'>×</button>
                  </span>
                )}
                {searchFilter && (
                  <span className='inline-flex items-center gap-1 bg-slate-100 text-[10px] font-bold text-slate-600 px-2.5 py-1 rounded-full'>
                    "{searchFilter}"
                    <button onClick={() => updateFilter('search', '')} className='hover:text-rose-500 cursor-pointer font-black ml-1'>×</button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className='inline-flex items-center gap-1 bg-slate-100 text-[10px] font-bold text-slate-600 px-2.5 py-1 rounded-full'>
                    ${minPrice || '0'} - ${maxPrice || '∞'}
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams)
                        newParams.delete('minPrice')
                        newParams.delete('maxPrice')
                        setSearchParams(newParams)
                        setPriceInput({ min: '', max: '' })
                      }}
                      className='hover:text-rose-500 cursor-pointer font-black ml-1'
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            <div className='space-y-3 mb-6'>
              <h3 className='text-xs font-extrabold text-slate-700 uppercase tracking-widest'>Categories</h3>
              <div className='space-y-1.5'>
                <button
                  onClick={() => updateFilter('category', 'All')}
                  className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer ${categoryFilter === 'All' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat._id}
                    onClick={() => updateFilter('category', generateNameId({ name: cat.name, id: cat._id }))}
                    className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer ${categoryFilter === generateNameId({ name: cat.name, id: cat._id }) ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-3 pt-4 border-t border-slate-100'>
              <h3 className='text-xs font-extrabold text-slate-700 uppercase tracking-widest'>Price Range</h3>
              <form onSubmit={handleApplyPrice} className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <div className='relative flex-1'>
                    <span className='absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400'>$</span>
                    <input
                      type='number'
                      placeholder='Min'
                      value={priceInput.min}
                      onChange={e => setPriceInput(prev => ({ ...prev, min: e.target.value }))}
                      className='w-full bg-slate-50 border border-slate-200/80 rounded-lg py-1.5 pl-5 pr-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition'
                    />
                  </div>
                  <span className='text-slate-300 font-bold text-xs'>-</span>
                  <div className='relative flex-1'>
                    <span className='absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400'>$</span>
                    <input
                      type='number'
                      placeholder='Max'
                      value={priceInput.max}
                      onChange={e => setPriceInput(prev => ({ ...prev, max: e.target.value }))}
                      className='w-full bg-slate-50 border border-slate-200/80 rounded-lg py-1.5 pl-5 pr-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition'
                    />
                  </div>
                </div>
                <button
                  type='submit'
                  className='w-full bg-slate-900 hover:bg-blue-600 text-white py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer shadow-sm hover:shadow'
                >
                  Apply Price
                </button>
              </form>
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
                    className='bg-white rounded-2xl p-5 flex flex-col justify-between border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden'
                  >
                    <div>
                      <div className='flex items-center gap-1.5 text-[9px] font-extrabold uppercase select-none mb-3'>
                        <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={inStock ? 'text-emerald-600' : 'text-rose-500'}>
                          {inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className='h-40 my-3 flex items-center justify-center bg-slate-50/60 rounded-2xl p-4 overflow-hidden relative border border-slate-100'>
                        <img
                          src={product.image}
                          alt={product.name}
                          className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out select-none'
                        />
                      </div>
                      <div className='flex items-center gap-1.5 my-3.5 select-none'>
                        <div className='flex text-amber-400'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3.5 h-3.5 fill-current ${i < Math.floor(product.rating || 5) ? 'text-amber-400' : 'text-slate-200'
                                }`}
                              viewBox='0 0 20 20'
                            >
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                          ))}
                        </div>
                        <span className='text-[10px] text-slate-400 font-bold'>
                          Đã bán ({product.sold || 0})
                        </span>
                      </div>

                      <h3 className='text-xs font-black text-slate-800 leading-snug hover:text-blue-600 transition-colors line-clamp-2 min-h-[36px]'>
                        {product.name}
                      </h3>
                    </div>
                    <div className='pt-3 border-t border-slate-100/70 flex items-center justify-between mt-auto'>
                      <div>
                        {product.price_before_discount && (
                          <span className='text-[10px] line-through text-slate-400 block leading-none select-none'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price_before_discount)}
                          </span>
                        )}
                        <div className='text-sm font-black text-slate-900 leading-none mt-1'>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleAddToCart(product._id)
                        }}
                        disabled={!inStock}
                        className={`h-9 w-9 rounded-xl flex items-center justify-center transition cursor-pointer select-none ${inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        title={inStock ? 'Add to Cart' : 'Out of Stock'}
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                        </svg>
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
                    className='bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 group relative overflow-hidden text-inherit no-underline block'
                  >

                    <div className='w-full sm:w-[180px] h-[140px] bg-slate-50/60 rounded-xl flex items-center justify-center p-4 relative border border-slate-100 flex-shrink-0'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 select-none'
                      />
                    </div>

                    <div className='flex-1 min-w-0 w-full'>
                      <div className='flex items-center gap-3 select-none mb-1.5'>
                        <div className='flex items-center gap-1 text-[9px] font-extrabold uppercase'>
                          <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className={inStock ? 'text-emerald-600' : 'text-rose-500'}>
                            {inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <h3 className='text-xs font-black text-slate-800 leading-snug hover:text-blue-600 transition-colors line-clamp-1'>
                        {product.name}
                      </h3>

                      <p className='text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed'>
                        {product.description}
                      </p>

                      <div className='flex items-center gap-1.5 my-2 select-none'>
                        <div className='flex text-amber-400'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3.5 h-3.5 fill-current ${i < Math.floor(product.rating || 5) ? 'text-amber-400' : 'text-slate-200'
                                }`}
                              viewBox='0 0 20 20'
                            >
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                          ))}
                        </div>
                        <span className='text-[10px] text-slate-400 font-bold'>
                          Đã bán ({product.sold || 0})
                        </span>
                      </div>
                    </div>

                    <div className='w-full sm:w-[150px] sm:border-l border-slate-100 sm:pl-6 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-4 flex-shrink-0'>
                      <div>
                        {product.price_before_discount && (
                          <span className='text-[10px] line-through text-slate-400 block leading-none select-none'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price_before_discount)}
                          </span>
                        )}
                        <div className='text-base font-black text-slate-900 leading-none mt-1.5'>
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
                        className={`h-9 px-4 w-full rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase transition cursor-pointer select-none ${inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
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
