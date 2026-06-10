import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import http from '../../../utils/http'
import { toast } from 'react-toastify'
import { useState } from 'react'

export default function ProductsAdmin() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  
  // Filter States
  const [page, setPage] = useState(1)
  const limit = 10
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    price_before_discount: 0,
    quantity: 0,
    category_id: '',
    image: '',
    description: ''
  })

  // Queries
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => http.get('/categories').then((r) => r.data.result)
  })

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', page, search, categoryFilter, priceMin, priceMax],
    queryFn: () => http.get('/products', { 
      params: { 
        limit, 
        page, 
        search: search || undefined,
        category: categoryFilter || undefined,
        price_min: priceMin || undefined,
        price_max: priceMax || undefined
      } 
    }).then((r) => r.data.result),
    keepPreviousData: true
  })
  
  const products = productsData?.products || []
  const totalPages = productsData?.pagination?.page_size || 1
  const totalProducts = productsData?.pagination?.total_items || products.length

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => http.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Deleted product successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: () => toast.error('Error deleting product!')
  })

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (editProduct) {
        return http.put(`/products/${editProduct._id}`, data)
      }
      return http.post('/products', data)
    },
    onSuccess: () => {
      toast.success(editProduct ? 'Updated successfully!' : 'Added successfully!')
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: () => toast.error('An error occurred while saving the product!')
  })

  // Handlers
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditProduct(product)
      setFormData({
        name: product.name,
        price: product.price,
        price_before_discount: product.price_before_discount,
        quantity: product.quantity,
        category_id: product.category_id,
        image: product.image,
        description: product.description || ''
      })
    } else {
      setEditProduct(null)
      setFormData({
        name: '', price: 0, price_before_discount: 0, quantity: 100, 
        category_id: categories?.[0]?._id || '', image: '', description: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }

  const formatPrice = (p: number) => p?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  if (isLoading) return <div className='flex justify-center mt-20'><div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div></div>

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-xl font-semibold text-dark'>Products Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className='bg-primary text-white px-5 py-2.5 font-semibold hover:bg-primary/90 transition rounded-md shadow-sm'
        >
          + Add product
        </button>
      </div>

      {/* Filter Bar */}
      <div className='bg-white p-6 border border-gray-200 rounded-md shadow-sm mb-6 flex flex-wrap gap-4 items-end'>
        <div className='flex-1 min-w-[200px]'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>Search</label>
          <input 
            type='text' 
            placeholder='Product name...' 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none rounded-md shadow-sm'
          />
        </div>
        
        <div className='w-48'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>Category</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none bg-white rounded-md shadow-sm'
          >
            <option value=''>All</option>
            {categories?.map((cat: any) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className='w-32'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>Min Price ($)</label>
          <input 
            type='number' 
            value={priceMin}
            onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
            className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none rounded-md shadow-sm'
          />
        </div>

        <div className='w-32'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>Max Price ($)</label>
          <input 
            type='number' 
            value={priceMax}
            onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
            className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none rounded-md shadow-sm'
          />
        </div>

        <button 
          onClick={() => { setSearch(''); setCategoryFilter(''); setPriceMin(''); setPriceMax(''); setPage(1); }}
          className='px-6 py-2 border border-gray-300 font-semibold text-dark bg-white hover:bg-gray-50 transition rounded-md shadow-sm'
        >
          Clear Filter
        </button>
      </div>

      <div className='bg-white border border-gray-200 overflow-hidden rounded-md shadow-sm'>
        <div className='p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50'>
          <h2 className='text-lg font-semibold text-dark'>Products List</h2>
        </div>
        
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200'>
                <th className='p-4 pl-6 w-20'>Image</th>
                <th className='p-4'>Product Name</th>
                <th className='p-4'>Price</th>
                <th className='p-4'>Stock</th>
                <th className='p-4'>Sold</th>
                <th className='p-4 pr-6 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 text-sm'>
              {products.map((product: any) => (
                <tr key={product._id} className='hover:bg-gray-50 transition-colors'>
                  <td className='p-4 pl-6'>
                    <img src={product.image} alt={product.name} className='w-12 h-12 object-contain bg-white border border-gray-200 p-1 rounded-md shadow-sm'/>
                  </td>
                  <td className='p-4 font-medium text-dark'>{product.name}</td>
                  <td className='p-4 text-primary font-semibold'>{formatPrice(product.price)}</td>
                  <td className='p-4 text-gray-600 font-medium'>{product.quantity}</td>
                  <td className='p-4 text-gray-600 font-medium'>{product.sold || 0}</td>
                  <td className='p-4 pr-6 text-right space-x-4'>
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className='text-primary hover:underline font-semibold transition'
                    >Edit</button>
                    <button 
                      onClick={() => handleDelete(product._id, product.name)}
                      className='text-red-600 hover:underline font-semibold transition'
                    >Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className='p-12 text-center text-gray-500'>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className='p-4 border-t border-gray-200 flex items-center justify-between bg-white'>
            <div className='text-sm text-gray-500 font-medium'>
              Page <span className='font-bold text-dark'>{page}</span> / {totalPages}
            </div>
            <div className='flex gap-2'>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className='px-4 py-2 border border-gray-300 rounded-md shadow-sm font-semibold text-sm disabled:opacity-50 hover:bg-gray-50 transition'
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className='px-4 py-2 border border-gray-300 rounded-md shadow-sm font-semibold text-sm disabled:opacity-50 hover:bg-gray-50 transition'
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal form */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <div className='p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center'>
              <h2 className='text-xl font-bold text-dark'>
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className='text-gray-400 hover:text-dark text-2xl font-bold'>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-dark mb-1'>Original Price</label>
                  <input required type='number' value={formData.price_before_discount} onChange={e => setFormData({...formData, price_before_discount: Number(e.target.value)})} className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none rounded-md'/>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-dark mb-1'>Sale Price</label>
                  <input required type='number' value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none rounded-md'/>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-dark mb-1'>Product Name <span className='text-red-500'>*</span></label>
                  <input required type='text' value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className='w-full border border-gray-300 px-4 py-2 rounded-md focus:border-primary outline-none'/>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-dark mb-1'>Category <span className='text-red-500'>*</span></label>
                  <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className='w-full border border-gray-300 px-4 py-2 rounded-md focus:border-primary outline-none bg-white'>
                    <option value='' disabled>Select category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-dark mb-1'>Quantity (Stock)</label>
                <input required type='number' value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none rounded-md'/>
              </div>

              <div>
                <label className='block text-sm font-semibold text-dark mb-1'>Image URL</label>
                <input required type='url' value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder='https://...' className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none rounded-md'/>
                {formData.image && <img src={formData.image} alt='Preview' className='mt-2 h-20 object-contain border border-gray-200 p-1 rounded-md' />}
              </div>

              <div>
                <label className='block text-sm font-semibold text-dark mb-1'>Product Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className='w-full border border-gray-300 px-4 py-2 focus:border-primary outline-none rounded-md'></textarea>
              </div>

              <div className='p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50'>
                <button type='button' onClick={() => setIsModalOpen(false)} className='px-6 py-2.5 border border-gray-300 font-semibold text-dark rounded-md bg-white hover:bg-gray-50 transition'>
                  Cancel
                </button>
                <button type='submit' disabled={saveMutation.isLoading} className='px-6 py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition shadow-sm disabled:opacity-50'>
                  {saveMutation.isLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
