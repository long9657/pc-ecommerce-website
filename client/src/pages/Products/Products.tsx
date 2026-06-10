import { useState, useMemo, useEffect } from 'react'
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
  const urlCategoryFilter = searchParams.get('category') || categorySlug || 'All'
  const urlCategoryId = urlCategoryFilter !== 'All' ? getIdFromNameId(urlCategoryFilter) : 'All'
  const urlMinPrice = searchParams.get('minPrice') || ''
  const urlMaxPrice = searchParams.get('maxPrice') || ''
  const urlColor = searchParams.get('color') || ''
  const urlBrand = searchParams.get('brand') || ''
  const sortBy = searchParams.get('sort') || 'newest'
  const searchFilter = searchParams.get('search') || ''
  const page = searchParams.get('page') || '1'

  // Local Filter States
  const [localCategory, setLocalCategory] = useState<string>(urlCategoryFilter)
  const [localMinPrice, setLocalMinPrice] = useState<string>(urlMinPrice)
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(urlMaxPrice)
  const [localColor, setLocalColor] = useState<string>(urlColor)
  const [localBrand, setLocalBrand] = useState<string>(urlBrand)

  // Sync local state when URL changes
  useEffect(() => {
    setLocalCategory(urlCategoryFilter)
    setLocalMinPrice(urlMinPrice)
    setLocalMaxPrice(urlMaxPrice)
    setLocalColor(urlColor)
    setLocalBrand(urlBrand)
  }, [urlCategoryFilter, urlMinPrice, urlMaxPrice, urlColor, urlBrand])

  // Accordion toggle states
  const [openCategory, setOpenCategory] = useState(true)
  const [openPrice, setOpenPrice] = useState(true)
  const [openColor, setOpenColor] = useState(true)
  const [openBrand, setOpenBrand] = useState(true)

  // Calculate pending filters count
  const pendingFiltersCount = useMemo(() => {
    let count = 0
    if (localCategory !== 'All') count++
    if (localMinPrice || localMaxPrice) count++
    if (localColor) count++
    if (localBrand) count++
    return count
  }, [localCategory, localMinPrice, localMaxPrice, localColor, localBrand])

  const applyLocalFilters = () => {
    const newParams = new URLSearchParams(searchParams)
    
    if (localCategory !== 'All') {
      newParams.set('category', localCategory)
    } else {
      newParams.delete('category')
    }

    if (localMinPrice) newParams.set('minPrice', localMinPrice)
    else newParams.delete('minPrice')

    if (localMaxPrice) newParams.set('maxPrice', localMaxPrice)
    else newParams.delete('maxPrice')

    if (localColor) newParams.set('color', localColor)
    else newParams.delete('color')

    if (localBrand) newParams.set('brand', localBrand)
    else newParams.delete('brand')

    newParams.set('page', '1') // Reset page on filter change
    
    if (categorySlug && localCategory === 'All') {
      navigate({ pathname: '/products', search: newParams.toString() })
    } else if (categorySlug && localCategory !== urlCategoryFilter) {
      navigate({ pathname: `/products/${localCategory}`, search: newParams.toString() })
    } else {
      setSearchParams(newParams)
    }
  }

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set(key, value)
    if (key !== 'page') newParams.set('page', '1') // Reset page on sort change
    
    if (categorySlug && urlCategoryFilter === 'All') {
      navigate({ pathname: '/products', search: newParams.toString() })
    } else if (categorySlug) {
      navigate({ pathname: `/products/${categorySlug}`, search: newParams.toString() })
    } else {
      setSearchParams(newParams)
    }
  }

  const clearAllFilters = () => {
    setLocalCategory('All')
    setLocalMinPrice('')
    setLocalMaxPrice('')
    setLocalColor('')
    setLocalBrand('')
    const newParams = new URLSearchParams()
    if (sortBy !== 'newest') newParams.set('sort', sortBy)
    if (searchFilter) newParams.set('search', searchFilter)
    navigate({ pathname: '/products', search: newParams.toString() })
  }

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  })
  const categories = categoriesData?.data?.result || []

  // Find Category Name for Display
  const currentCategoryName = useMemo(() => {
    if (urlCategoryFilter === 'All') return 'Full Hardware Store'
    const cat = categories.find((c: any) => c._id === urlCategoryId)
    return cat ? cat.name : urlCategoryFilter
  }, [urlCategoryFilter, categories, urlCategoryId])

  // Fetch Products
  const queryConfig = {
    category: urlCategoryId !== 'All' ? urlCategoryId : undefined,
    search: searchFilter || undefined,
    price_min: urlMinPrice || undefined,
    price_max: urlMaxPrice || undefined,
    color: urlColor || undefined,
    brand: urlBrand || undefined,
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

  const priceRanges = [
    { label: '$0.00 - $1,000.00', min: '0', max: '1000' },
    { label: '$1,000.00 - $2,000.00', min: '1000', max: '2000' },
    { label: '$2,000.00 - $3,000.00', min: '2000', max: '3000' },
    { label: '$3,000.00 - $4,000.00', min: '3000', max: '4000' },
    { label: '$4,000.00 - $5,000.00', min: '4000', max: '5000' },
    { label: '$5,000.00 - $6,000.00', min: '5000', max: '6000' },
    { label: '$6,000.00 - $7,000.00', min: '6000', max: '7000' },
    { label: '$7,000.00 And Above', min: '7000', max: '' }
  ]

  return (
    <div className='min-h-screen bg-slate-50 font-sans p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center gap-1.5 text-xs text-dark opacity-70 mb-4'>
          <Link to='/' className='hover:text-primary transition'>Home</Link>
          <span className='opacity-50'>›</span>
          <Link to='/products' className='hover:text-primary transition'>Products</Link>
          {urlCategoryFilter !== 'All' && (
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
              <div className='flex items-center justify-between cursor-pointer mb-4' onClick={() => setOpenCategory(!openCategory)}>
                <h3 className='text-xs font-bold text-dark'>Category</h3>
                <svg className={`w-3 h-3 text-dark transition-transform ${openCategory ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
              </div>
              {openCategory && (
                <div className='space-y-3'>
                  {categories.map((cat: any) => {
                    const catSlug = generateNameId({ name: cat.name, id: cat._id })
                    const isSelected = localCategory === catSlug
                    return (
                      <div 
                        key={cat._id}
                        onClick={() => setLocalCategory(isSelected ? 'All' : catSlug)}
                        className={`flex items-center justify-between text-xs cursor-pointer ${isSelected ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary transition-colors'}`}
                      >
                        <span>{cat.name}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Price Accordion */}
            <div className='border-b border-gray-200 pb-4 mb-4'>
              <div className='flex items-center justify-between cursor-pointer mb-4' onClick={() => setOpenPrice(!openPrice)}>
                <h3 className='text-xs font-bold text-dark'>Price</h3>
                <svg className={`w-3 h-3 text-dark transition-transform ${openPrice ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
              </div>
              {openPrice && (
                <div className='space-y-3'>
                  {priceRanges.map((range, idx) => {
                    const isSelected = localMinPrice === range.min && localMaxPrice === range.max
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (isSelected) {
                            setLocalMinPrice('')
                            setLocalMaxPrice('')
                          } else {
                            setLocalMinPrice(range.min)
                            setLocalMaxPrice(range.max)
                          }
                        }}
                        className={`flex items-center justify-between text-xs cursor-pointer ${isSelected ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary transition-colors'}`}
                      >
                        <span>{range.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Color Accordion */}
            <div className='border-b border-gray-200 pb-4 mb-4'>
              <div className='flex items-center justify-between cursor-pointer mb-4' onClick={() => setOpenColor(!openColor)}>
                <h3 className='text-xs font-bold text-dark'>Color</h3>
                <svg className={`w-3 h-3 text-dark transition-transform ${openColor ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
              </div>
              {openColor && (
                <div className='flex items-center gap-2'>
                  <div 
                    onClick={() => setLocalColor(localColor === 'black' ? '' : 'black')} 
                    className={`w-6 h-6 rounded-full bg-black cursor-pointer border-2 transition-colors ${localColor === 'black' ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                    title='Black'
                  ></div>
                  <div 
                    onClick={() => setLocalColor(localColor === 'red' ? '' : 'red')} 
                    className={`w-6 h-6 rounded-full bg-red-600 cursor-pointer border-2 transition-colors ${localColor === 'red' ? 'border-primary' : 'border-transparent hover:border-red-400'}`}
                    title='Red'
                  ></div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className='border-b border-gray-200 pb-4 mb-4'>
              <button 
                onClick={applyLocalFilters}
                className='w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-50'
                disabled={pendingFiltersCount === 0 && urlCategoryFilter === 'All' && !urlMinPrice && !urlMaxPrice && !urlColor}
              >
                Apply Filters {pendingFiltersCount > 0 ? `(${pendingFiltersCount})` : ''}
              </button>
            </div>

            {/* Brands Accordion */}
            <div className='border-b border-gray-200 pb-4 mb-4'>
              <div className='flex items-center justify-between cursor-pointer mb-4' onClick={() => setOpenBrand(!openBrand)}>
                <h3 className='text-xs font-bold text-dark'>Brands</h3>
                <svg className={`w-3 h-3 text-dark transition-transform ${openBrand ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
              </div>
              {openBrand && (
                <div className='space-y-3'>
                  {['MSI', 'ASUS', 'Gigabyte', 'Razer', 'Intel', 'AMD'].map((brand) => {
                    const isSelected = localBrand === brand
                    return (
                      <div 
                        key={brand}
                        onClick={() => setLocalBrand(isSelected ? '' : brand)}
                        className={`flex items-center justify-between text-xs cursor-pointer ${isSelected ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary transition-colors'}`}
                      >
                        <span>{brand}</span>
                      </div>
                    )
                  })}
                </div>
              )}
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

          {/* Active Filters */}
          {(urlCategoryFilter !== 'All' || urlMinPrice || urlMaxPrice || searchFilter || urlColor || urlBrand) && (
            <div className='flex flex-wrap items-center gap-3 mb-6 animate-fade-in'>
              <span className='text-sm font-bold text-dark'>Filters</span>
              
              {urlCategoryFilter !== 'All' && (
                <div className='flex items-center gap-2 px-3 py-1.5 border-2 border-gray-200 rounded bg-white text-[11px] font-bold text-dark'>
                  {currentCategoryName}
                  <button onClick={() => {
                      setLocalCategory('All')
                      const newParams = new URLSearchParams(searchParams)
                      newParams.delete('category')
                      newParams.set('page', '1')
                      navigate({ pathname: '/products', search: newParams.toString() })
                  }} className='text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'/></svg>
                  </button>
                </div>
              )}

              {(urlMinPrice || urlMaxPrice) && (
                <div className='flex items-center gap-2 px-3 py-1.5 border-2 border-gray-200 rounded bg-white text-[11px] font-bold text-dark'>
                  {priceRanges.find(r => r.min === urlMinPrice && r.max === urlMaxPrice)?.label || `$${urlMinPrice} - $${urlMaxPrice}`}
                  <button onClick={() => {
                      setLocalMinPrice('')
                      setLocalMaxPrice('')
                      const newParams = new URLSearchParams(searchParams)
                      newParams.delete('minPrice')
                      newParams.delete('maxPrice')
                      newParams.set('page', '1')
                      setSearchParams(newParams)
                  }} className='text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'/></svg>
                  </button>
                </div>
              )}

              {searchFilter && (
                <div className='flex items-center gap-2 px-3 py-1.5 border-2 border-gray-200 rounded bg-white text-[11px] font-bold text-dark'>
                  Search: {searchFilter}
                  <button onClick={() => {
                      const newParams = new URLSearchParams(searchParams)
                      newParams.delete('search')
                      newParams.set('page', '1')
                      setSearchParams(newParams)
                  }} className='text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'/></svg>
                  </button>
                </div>
              )}

              {urlColor && (
                <div className='flex items-center gap-2 px-3 py-1.5 border-2 border-gray-200 rounded bg-white text-[11px] font-bold text-dark'>
                  Color: <span className='capitalize'>{urlColor}</span>
                  <button onClick={() => {
                      setLocalColor('')
                      const newParams = new URLSearchParams(searchParams)
                      newParams.delete('color')
                      newParams.set('page', '1')
                      setSearchParams(newParams)
                  }} className='text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'/></svg>
                  </button>
                </div>
              )}

              {urlBrand && (
                <div className='flex items-center gap-2 px-3 py-1.5 border-2 border-gray-200 rounded bg-white text-[11px] font-bold text-dark'>
                  Brand: {urlBrand}
                  <button onClick={() => {
                      setLocalBrand('')
                      const newParams = new URLSearchParams(searchParams)
                      newParams.delete('brand')
                      newParams.set('page', '1')
                      setSearchParams(newParams)
                  }} className='text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'/></svg>
                  </button>
                </div>
              )}

              <button 
                onClick={clearAllFilters}
                className='px-4 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded text-[11px] font-bold text-dark transition-colors cursor-pointer'
              >
                Clear All
              </button>
            </div>
          )}

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
                    
                    <div className='pt-3 mt-auto relative z-10'>
                      {product.price_before_discount && (
                        <span className='text-[12px] line-through text-gray-400 block leading-none select-none mb-1 opacity-100 group-hover:opacity-0 transition-opacity'>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price_before_discount)}
                        </span>
                      )}
                      <div className='text-[18px] font-bold text-dark leading-none opacity-100 group-hover:opacity-0 transition-opacity'>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                      </div>

                      <div className='absolute top-0 left-0 right-0 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addToCartMutation.mutate(product._id)
                          }}
                          disabled={!inStock}
                          className={`w-full py-2.5 rounded-full flex items-center justify-center gap-2 border-2 transition-all cursor-pointer font-bold text-sm ${inStock ? 'border-primary text-primary hover:bg-primary hover:text-white' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' /></svg>
                          {inStock ? 'Add To Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>

                    {/* Top right hover icons */}
                    <div className='absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20'>
                      <button onClick={(e) => {e.preventDefault(); e.stopPropagation()}} className='w-8 h-8 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center hover:text-dark hover:border-dark bg-white transition-colors'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' /></svg>
                      </button>
                      <button onClick={(e) => {e.preventDefault(); e.stopPropagation()}} className='w-8 h-8 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center hover:text-dark hover:border-dark bg-white transition-colors'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' /></svg>
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
                    to={`/${categorySlug || categories.find((c: any) => c._id === product.category_id)?.name || 'products'}/${generateNameId({ name: product.name, id: product._id })}`}
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
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price_before_discount)}
                          </span>
                        )}
                        <div className='text-[20px] font-bold text-dark leading-none'>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCartMutation.mutate(product._id)
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
