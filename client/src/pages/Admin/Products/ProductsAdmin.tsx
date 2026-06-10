import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import http from '../../../utils/http'
import { toast } from 'react-toastify'
import { useState } from 'react'

export default function ProductsAdmin() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  
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
    queryKey: ['admin-products'],
    queryFn: () => http.get('/products', { params: { limit: 100 } }).then((r) => r.data.result)
  })
  
  const products = productsData?.products || []

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => http.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: () => toast.error('Lỗi khi xóa sản phẩm!')
  })

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (editProduct) {
        return http.put(`/products/${editProduct._id}`, data)
      }
      return http.post('/products', data)
    },
    onSuccess: () => {
      toast.success(editProduct ? 'Cập nhật thành công!' : 'Thêm mới thành công!')
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: () => toast.error('Có lỗi xảy ra khi lưu sản phẩm!')
  })

  // Handlers
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${name}"?`)) {
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
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-slate-800'>Quản lý Sản phẩm</h1>
        <button 
          onClick={() => handleOpenModal()}
          className='bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm'
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50'>
          <h2 className='text-lg font-bold text-slate-700'>Danh sách Sản phẩm ({products.length})</h2>
        </div>
        
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200'>
                <th className='p-4 pl-6 w-20'>Ảnh</th>
                <th className='p-4'>Tên sản phẩm</th>
                <th className='p-4'>Giá bán</th>
                <th className='p-4'>Tồn kho</th>
                <th className='p-4'>Đã bán</th>
                <th className='p-4 pr-6 text-right'>Hành động</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 text-sm'>
              {products.map((product: any) => (
                <tr key={product._id} className='hover:bg-slate-50 transition-colors'>
                  <td className='p-4 pl-6'>
                    <img src={product.image} alt={product.name} className='w-12 h-12 object-contain bg-white rounded-md border border-slate-200 p-1'/>
                  </td>
                  <td className='p-4 font-bold text-slate-800'>{product.name}</td>
                  <td className='p-4 text-blue-600 font-bold'>{formatPrice(product.price)}</td>
                  <td className='p-4 text-slate-600 font-medium'>{product.quantity}</td>
                  <td className='p-4 text-slate-600 font-medium'>{product.sold || 0}</td>
                  <td className='p-4 pr-6 text-right space-x-2'>
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className='bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-lg font-semibold transition'
                    >Sửa</button>
                    <button 
                      onClick={() => handleDelete(product._id, product.name)}
                      className='bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-semibold transition'
                    >Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <div className='p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10'>
              <h2 className='text-xl font-bold text-slate-800'>{editProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className='text-slate-400 hover:text-slate-700 text-2xl font-bold'>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1'>Tên sản phẩm</label>
                <input required type='text' value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className='w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'/>
              </div>
              
              <div className='grid grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1'>Giá bán (VNĐ)</label>
                  <input required type='number' value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className='w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'/>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1'>Giá gốc (VNĐ)</label>
                  <input required type='number' value={formData.price_before_discount} onChange={e => setFormData({...formData, price_before_discount: Number(e.target.value)})} className='w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'/>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1'>Số lượng (Tồn kho)</label>
                  <input required type='number' value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className='w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'/>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1'>Danh mục</label>
                  <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className='w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white'>
                    {categories?.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1'>Link Ảnh (URL)</label>
                <input required type='url' value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder='https://...' className='w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'/>
                {formData.image && <img src={formData.image} alt='Preview' className='mt-2 h-20 object-contain rounded border border-slate-200' />}
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1'>Mô tả sản phẩm</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className='w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'></textarea>
              </div>

              <div className='pt-4 border-t border-slate-100 flex justify-end gap-3'>
                <button type='button' onClick={() => setIsModalOpen(false)} className='px-6 py-2.5 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition'>Hủy</button>
                <button type='submit' disabled={saveMutation.isLoading} className='px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50'>
                  {saveMutation.isLoading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
