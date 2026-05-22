import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router'
import { MOCK_PRODUCTS } from '../../utils/mockProducts'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [cartFeedback, setCartFeedback] = useState<string | null>(null)

  // 1. Get filters from URL Search Params
  const categoryFilter = searchParams.get('category') || 'All'
  const brandFilter = searchParams.get('brand') || 'All'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sortBy = searchParams.get('sort') || 'featured'
  const searchFilter = searchParams.get('search') || ''

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
    setSearchParams(newParams)
  }

  // Update a single filter helper
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === 'All' || !value) {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    setSearchParams(newParams)
  }

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams())
    setPriceInput({ min: '', max: '' })
  }

  // 2. Dynamic Count Calculations
  const counts = useMemo(() => {
    const categories: Record<string, number> = {}
    const brands: Record<string, number> = {}
    
    MOCK_PRODUCTS.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1
      brands[p.brand] = (brands[p.brand] || 0) + 1
    })

    return { categories, brands }
  }, [])

  // 3. Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS]

    // Category
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter)
    }

    // Brand
    if (brandFilter !== 'All') {
      result = result.filter(p => p.brand === brandFilter)
    }

    // Min Price
    if (minPrice) {
      const minVal = parseFloat(minPrice)
      if (!isNaN(minVal)) {
        result = result.filter(p => p.price >= minVal)
      }
    }

    // Max Price
    if (maxPrice) {
      const maxVal = parseFloat(maxPrice)
      if (!isNaN(maxVal)) {
        result = result.filter(p => p.price <= maxVal)
      }
    }

    if (searchFilter) {
      result = result.filter(p => p.name.toLowerCase().includes(searchFilter.toLocaleLowerCase()))
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [categoryFilter, brandFilter, minPrice, maxPrice, sortBy, searchFilter])

  // Mock add to cart micro-animation feedback
  const handleAddToCart = (productName: string) => {
    setCartFeedback(productName)
    setTimeout(() => {
      setCartFeedback(null)
    }, 2000)
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans p-6'>
      {cartFeedback && (
        <div className='fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce'>
          <span className='w-2 h-2 rounded-full bg-emerald-500 animate-ping' />
          <span className='text-xs font-bold'>Added to Cart: {cartFeedback}</span>
        </div>
      )}

      <nav className='max-w-7xl mx-auto flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-6'>
        <Link to='/' className='hover:text-blue-600 transition'>Home</Link>
        <span>/</span>
        <Link to='/products' className='hover:text-blue-600 transition text-slate-600'>Products</Link>
        {categoryFilter !== 'All' && (
          <>
            <span>/</span>
            <span className='text-slate-900 font-black'>{categoryFilter}</span>
          </>
        )}
      </nav>

      <div className='max-w-7xl mx-auto bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-lg border border-slate-800'>
        <div className='absolute right-0 top-0 w-[50%] h-full opacity-10 bg-radial-gradient from-blue-400 to-transparent pointer-events-none' />
        <div className='max-w-xl text-white relative z-10 select-none'>
          <span className='text-[10px] font-extrabold tracking-widest uppercase bg-blue-600/30 text-blue-400 px-3.5 py-1.5 rounded-full border border-blue-500/20'>
            {brandFilter !== 'All' ? brandFilter : 'All Brands'}
          </span>
          <h1 className='text-3xl md:text-4xl font-extrabold mt-4 tracking-tight leading-tight uppercase font-sans'>
            {categoryFilter !== 'All' ? categoryFilter : 'Full Hardware Store'}
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
              {(categoryFilter !== 'All' || brandFilter !== 'All' || minPrice || maxPrice) && (
                <button
                  onClick={clearAllFilters}
                  className='text-[10px] font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer'
                >
                  Clear All
                </button>
              )}
            </div>

            {(categoryFilter !== 'All' || brandFilter !== 'All' || minPrice || maxPrice) && (
              <div className='flex flex-wrap gap-1.5 mb-6 border-b border-slate-100 pb-4'>
                {categoryFilter !== 'All' && (
                  <span className='inline-flex items-center gap-1 bg-slate-100 text-[10px] font-bold text-slate-600 px-2.5 py-1 rounded-full'>
                    {categoryFilter}
                    <button onClick={() => updateFilter('category', 'All')} className='hover:text-rose-500 cursor-pointer font-black ml-1'>×</button>
                  </span>
                )}
                {brandFilter !== 'All' && (
                  <span className='inline-flex items-center gap-1 bg-slate-100 text-[10px] font-bold text-slate-600 px-2.5 py-1 rounded-full'>
                    {brandFilter}
                    <button onClick={() => updateFilter('brand', 'All')} className='hover:text-rose-500 cursor-pointer font-black ml-1'>×</button>
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
                  className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer ${
                    categoryFilter === 'All' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className={`text-[10px] ${categoryFilter === 'All' ? 'text-white' : 'text-slate-400'}`}>
                    {MOCK_PRODUCTS.length}
                  </span>
                </button>
                {['Laptops', 'Desktop PCs', 'Peripherals', 'PC Parts'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer ${
                      categoryFilter === cat ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] ${categoryFilter === cat ? 'text-white' : 'text-slate-400'}`}>
                      {counts.categories[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-3 mb-6 pt-4 border-t border-slate-100'>
              <h3 className='text-xs font-extrabold text-slate-700 uppercase tracking-widest'>Brands</h3>
              <div className='space-y-1'>
                <label className='flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer'>
                  <input
                    type='radio'
                    name='brand'
                    checked={brandFilter === 'All'}
                    onChange={() => updateFilter('brand', 'All')}
                    className='accent-blue-600'
                  />
                  <span className={`text-xs font-semibold ${brandFilter === 'All' ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    All Brands
                  </span>
                </label>
                {['MSI', 'Razer', 'Gigabyte', 'ASUS ROG'].map(br => (
                  <label key={br} className='flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer'>
                    <input
                      type='radio'
                      name='brand'
                      checked={brandFilter === br}
                      onChange={() => updateFilter('brand', br)}
                      className='accent-blue-600'
                    />
                    <span className={`text-xs font-semibold ${brandFilter === br ? 'text-slate-900 font-black' : 'text-slate-500'}`}>
                      {br}
                    </span>
                    <span className='ml-auto text-[10px] text-slate-400 font-bold'>
                      ({counts.brands[br] || 0})
                    </span>
                  </label>
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
            <div className='text-xs font-bold text-slate-500'>
              Showing <span className='text-slate-900'>{filteredProducts.length}</span> products matching your criteria
            </div>

            <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
              <div className='flex items-center gap-2'>
                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => updateFilter('sort', e.target.value)}
                  className='bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-1.5 px-3 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer transition'
                >
                  <option value='featured'>Featured</option>
                  <option value='price-asc'>Price: Low to High</option>
                  <option value='price-desc'>Price: High to Low</option>
                  <option value='rating'>Top Rated</option>
                  <option value='name'>Name: A to Z</option>
                </select>
              </div>

              <div className='flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/30'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title='Grid View'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
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

          {filteredProducts.length === 0 && (
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
              {filteredProducts.map(product => (
                <Link to={`/product/${product.id}`}
                  key={product.id}
                  className='bg-white rounded-2xl p-5 flex flex-col justify-between border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden'
                >
                  {product.badge && (
                    <span className='absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold uppercase tracking-widest text-[8px] px-2.5 py-1 rounded-full shadow-sm z-10 select-none'>
                      {product.badge}
                    </span>
                  )}

                  <div>
                    <div className='flex items-center gap-1.5 text-[9px] font-extrabold uppercase select-none mb-3'>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className={product.inStock ? 'text-emerald-600' : 'text-rose-500'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className='h-40 my-3 flex items-center justify-center bg-slate-50/60 rounded-2xl p-4 overflow-hidden relative border border-slate-100'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out select-none'
                      />
                    </div>
                    <div className='flex items-center gap-1.5 my-3.5 select-none'>
                      <div className='flex text-amber-400'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 fill-current ${
                              i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'
                            }`}
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                      <span className='text-[10px] text-slate-400 font-bold'>
                        Reviews ({product.reviewsCount})
                      </span>
                    </div>

                    <h3 className='text-xs font-black text-slate-800 leading-snug hover:text-blue-600 transition-colors line-clamp-2 min-h-[36px]'>
                      {product.name}
                    </h3>


                    <div className='bg-slate-50 border border-slate-100 rounded-xl p-2.5 my-3.5 space-y-1 text-[10px] text-slate-500 font-bold'>
                      {product.specs.cpu && (
                        <div className='flex justify-between'>
                          <span className='text-slate-400'>CPU:</span>
                          <span className='text-slate-700 text-right'>{product.specs.cpu}</span>
                        </div>
                      )}
                      {product.specs.gpu && (
                        <div className='flex justify-between'>
                          <span className='text-slate-400'>GPU:</span>
                          <span className='text-slate-700 text-right'>{product.specs.gpu}</span>
                        </div>
                      )}
                      {product.specs.ram && (
                        <div className='flex justify-between'>
                          <span className='text-slate-400'>RAM:</span>
                          <span className='text-slate-700 text-right'>{product.specs.ram}</span>
                        </div>
                      )}
                      {product.specs.switchType && (
                        <div className='flex justify-between'>
                          <span className='text-slate-400'>Switch:</span>
                          <span className='text-slate-700 text-right'>{product.specs.switchType}</span>
                        </div>
                      )}
                      {product.specs.sensor && (
                        <div className='flex justify-between'>
                          <span className='text-slate-400'>Sensor:</span>
                          <span className='text-slate-700 text-right'>{product.specs.sensor}</span>
                        </div>
                      )}
                      {product.specs.chipset && (
                        <div className='flex justify-between'>
                          <span className='text-slate-400'>Chipset:</span>
                          <span className='text-slate-700 text-right'>{product.specs.chipset}</span>
                        </div>
                      )}
                      {product.specs.power && (
                        <div className='flex justify-between'>
                          <span className='text-slate-400'>Output:</span>
                          <span className='text-slate-700 text-right'>{product.specs.power}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='pt-3 border-t border-slate-100/70 flex items-center justify-between mt-auto'>
                    <div>
                      {product.oldPrice && (
                        <span className='text-[10px] line-through text-slate-400 block leading-none select-none'>
                          ${product.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <div className='text-sm font-black text-slate-900 leading-none mt-1'>
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {e.preventDefault() 
                                      e.stopPropagation() 
                                      handleAddToCart(product.name)
                                    }} 
                      disabled={!product.inStock}
                      className={`h-9 w-9 rounded-xl flex items-center justify-center transition cursor-pointer select-none ${
                        product.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                      </svg>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredProducts.map(product => (
                <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className='bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 group relative overflow-hidden text-inherit no-underline block'
                  >

                  {product.badge && (
                    <span className='absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold uppercase tracking-widest text-[8px] px-2.5 py-1 rounded-full shadow-sm z-10 select-none'>
                      {product.badge}
                    </span>
                  )}

                  <div className='w-full sm:w-[180px] h-[140px] bg-slate-50/60 rounded-xl flex items-center justify-center p-4 relative border border-slate-100 flex-shrink-0'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 select-none'
                    />
                  </div>

                  <div className='flex-1 min-w-0 w-full'>
                    <div className='flex items-center gap-3 select-none mb-1.5'>
                      <span className='text-[10px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 rounded'>
                        {product.brand}
                      </span>
                      <div className='flex items-center gap-1 text-[9px] font-extrabold uppercase'>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={product.inStock ? 'text-emerald-600' : 'text-rose-500'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <h3 className='text-xs font-black text-slate-800 leading-snug hover:text-blue-600 transition-colors line-clamp-1'>
                      {product.name}
                    </h3>

                    <div className='flex items-center gap-1.5 my-2 select-none'>
                      <div className='flex text-amber-400'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 fill-current ${
                              i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'
                            }`}
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                      <span className='text-[10px] text-slate-400 font-bold'>
                        Reviews ({product.reviewsCount})
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-2 mt-3'>
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className='bg-slate-100/80 border border-slate-200/30 text-[9px] font-extrabold text-slate-600 uppercase px-2.5 py-1 rounded-lg flex items-center gap-1.5'>
                          <span className='text-slate-400'>{key}:</span>
                          <span>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='w-full sm:w-[150px] sm:border-l border-slate-100 sm:pl-6 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-4 flex-shrink-0'>
                    <div>
                      {product.oldPrice && (
                        <span className='text-[10px] line-through text-slate-400 block leading-none select-none'>
                          ${product.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <div className='text-base font-black text-slate-900 leading-none mt-1.5'>
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        handleAddToCart(product.name)
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      disabled={!product.inStock}
                      className={`h-9 px-4 w-full rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase transition cursor-pointer select-none ${
                        product.inStock
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
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className='flex items-center justify-center gap-2 mt-12 mb-6 select-none'>
              <button className='w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition cursor-pointer text-xs font-bold'>
                «
              </button>
              <button className='w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-sm shadow-blue-200'>
                1
              </button>
              <button className='w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition cursor-pointer text-xs font-bold'>
                2
              </button>
              <button className='w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition cursor-pointer text-xs font-bold'>
                3
              </button>
              <button className='w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition cursor-pointer text-xs font-bold'>
                »
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
