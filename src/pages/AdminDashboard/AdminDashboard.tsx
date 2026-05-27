import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import http from '../../utils/http'
import { toast } from 'react-toastify'
import { Link } from 'react-router'

const STATUS_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Chờ xác nhận', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  2: { label: 'Đang xử lý', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  3: { label: 'Đã giao', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  4: { label: 'Đã hủy', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
}

const STATUS_ACTIONS: Record<number, { next: number; label: string; color: string }[]> = {
  1: [
    { next: 2, label: '✅ Xác nhận', color: 'bg-blue-600 hover:bg-blue-700' },
    { next: 4, label: '❌ Hủy đơn', color: 'bg-rose-900 hover:bg-rose-950 text-rose-200' }
  ],
  2: [
    { next: 3, label: '🚚 Đã giao', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { next: 4, label: '❌ Hủy đơn', color: 'bg-rose-900 hover:bg-rose-950 text-rose-200' }
  ],
  3: [],
  4: []
}

interface ProductFormState {
  name: string
  price: string
  price_before_discount: string
  quantity: string
  description: string
  category_id: string
  image: string
}

const initialProductForm: ProductFormState = {
  name: '',
  price: '',
  price_before_discount: '',
  quantity: '',
  description: '',
  category_id: '',
  image: ''
}

export default function AdminDashboard() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders')

  // --- Search & Filters States ---
  const [productSearch, setProductSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<number | 'all'>('all')

  // --- Modals & Edit States ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm)
  const [isUploading, setIsUploading] = useState(false)

  // Category States
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

  // ==========================================
  // 1. DATA FETCHING (React Query)
  // ==========================================

  // Fetch Purchases (Orders)
  const { data: purchases, isLoading: isPurchasesLoading, error: purchasesError } = useQuery({
    queryKey: ['admin-purchases'],
    queryFn: () => http.get('/purchases/admin/all').then((r) => r.data.result)
  })

  // Fetch Products
  const { data: productsData } = useQuery({
    queryKey: ['admin-products-all'],
    queryFn: () => http.get('/products', { params: { limit: 1000 } }).then((r) => r.data.result.products)
  })
  const products = productsData || []

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => http.get('/categories').then((r) => r.data.result)
  })
  const categories = categoriesData || []

  // ==========================================
  // 2. MUTATIONS
  // ==========================================

  // Order status update
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) =>
      http.patch(`/purchases/admin/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái đơn hàng thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-purchases'] })
    },
    onError: () => toast.error('Có lỗi xảy ra!')
  })

  // Create Product
  const createProductMutation = useMutation({
    mutationFn: (data: any) => http.post('/products', data),
    onSuccess: () => {
      toast.success('Thêm sản phẩm mới thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-products-all'] })
      handleCloseProductModal()
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!'
      toast.error(msg)
    }
  })

  // Update Product
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => http.put(`/products/${id}`, data),
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-products-all'] })
      handleCloseProductModal()
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm!'
      toast.error(msg)
    }
  })

  // Delete Product handler
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => http.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-products-all'] })
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Không thể xóa sản phẩm này!'
      toast.error(msg)
    }
  })

  // Create Category
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => http.post('/categories', { name }),
    onSuccess: () => {
      toast.success('Thêm danh mục mới thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setNewCategoryName('')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra!'
      toast.error(msg)
    }
  })

  // Update Category
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => http.put(`/categories/${id}`, { name }),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setEditingCategoryId(null)
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra!'
      toast.error(msg)
    }
  })

  // Delete Category
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => http.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Không thể xóa danh mục đang có sản phẩm!'
      toast.error(msg)
    }
  })

  // ==========================================
  // 3. EVENT HANDLERS & HELPERS
  // ==========================================

  const formatPrice = (price: number) =>
    price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('vi-VN')

  // Group purchases for count badges
  const groupedOrders: Record<number, any[]> = useMemo(() => {
    const res: Record<number, any[]> = { 1: [], 2: [], 3: [], 4: [] }
    if (purchases) {
      purchases.forEach((p: any) => {
        if (res[p.status]) res[p.status].push(p)
      })
    }
    return res
  }, [purchases])

  // Filtered orders for display
  const filteredOrders = useMemo(() => {
    if (!purchases) return []
    if (orderStatusFilter === 'all') return purchases
    return purchases.filter((o: any) => o.status === orderStatusFilter)
  }, [purchases, orderStatusFilter])

  // Filtered products for client-side search
  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products.filter((p: any) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    )
  }, [products, productSearch])

  // Product Image Upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setIsUploading(true)
    try {
      const response = await http.post('/medias/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const imageUrl = response.data.result
      setProductForm((prev) => ({ ...prev, image: imageUrl }))
      toast.success('Upload ảnh thành công!')
    } catch (error) {
      toast.error('Lỗi khi tải ảnh lên server!')
    } finally {
      setIsUploading(false)
    }
  }

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      price: '',
      price_before_discount: '',
      quantity: '',
      description: '',
      category_id: categories[0]?._id || '',
      image: ''
    })
    setIsProductModalOpen(true)
  }

  // Open Edit Product Modal
  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      price: String(product.price),
      price_before_discount: String(product.price_before_discount || product.price),
      quantity: String(product.quantity),
      description: product.description || '',
      category_id: product.category?._id || product.category || '',
      image: product.image
    })
    setIsProductModalOpen(true)
  }

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false)
    setEditingProduct(null)
    setProductForm(initialProductForm)
  }

  // Submit Product Form
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name || !productForm.price || !productForm.quantity || !productForm.image || !productForm.category_id) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc và tải lên ảnh!')
      return
    }

    const payload = {
      name: productForm.name,
      price: Number(productForm.price),
      price_before_discount: Number(productForm.price_before_discount || productForm.price),
      quantity: Number(productForm.quantity),
      description: productForm.description,
      category_id: productForm.category_id,
      image: productForm.image
    }

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, data: payload })
    } else {
      createProductMutation.mutate(payload)
    }
  }

  // Delete Product handler
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
      deleteProductMutation.mutate(id)
    }
  }

  // Category Handlers
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) {
      toast.error('Tên danh mục không được để trống!')
      return
    }
    createCategoryMutation.mutate(newCategoryName.trim())
  }

  const handleStartEditCategory = (id: string, name: string) => {
    setEditingCategoryId(id)
    setEditingCategoryName(name)
  }

  const handleSaveCategory = (id: string) => {
    if (!editingCategoryName.trim()) {
      toast.error('Tên danh mục không được để trống!')
      return
    }
    updateCategoryMutation.mutate({ id, name: editingCategoryName.trim() })
  }

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`)) {
      deleteCategoryMutation.mutate(id)
    }
  }

  // ==========================================
  // Render loading / error states
  // ==========================================

  if (isPurchasesLoading && activeTab === 'orders') {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#080b11]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
          <p className='text-slate-400 font-medium text-sm animate-pulse'>Đang tải dữ liệu PCStore Admin...</p>
        </div>
      </div>
    )
  }

  if (purchasesError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-[#080b11] text-white gap-6 px-4 text-center'>
        <div className='w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(239,68,68,0.1)] border border-rose-500/20'>
          🔒
        </div>
        <div>
          <h2 className='text-2xl font-black tracking-tight text-slate-100 uppercase'>Truy cập bị từ chối</h2>
          <p className='text-slate-400 mt-2 text-sm max-w-md mx-auto leading-relaxed'>
            Tài khoản của bạn không có quyền Admin hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập bằng tài khoản Quản trị viên để tiếp tục.
          </p>
        </div>
        <Link to='/login' className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all uppercase tracking-wider text-xs'>
          Đăng nhập ngay
        </Link>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-[#080b11] text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200'>
      
      {/* ==========================================
          SIDEBAR
          ========================================== */}
      <aside className='w-[280px] bg-[#0b0f19] border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 relative select-none'>
        <div>
          {/* Brand/Logo */}
          <div className='p-6 border-b border-slate-800/50 flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20'>
              🛡️
            </div>
            <div>
              <h2 className='text-sm font-black tracking-wider text-white uppercase leading-none'>PCStore Admin</h2>
              <span className='text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 block'>Hệ thống quản lý</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className='p-4 space-y-1.5 mt-4'>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 text-left text-xs uppercase font-extrabold tracking-wider ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-blue-600/15 to-indigo-600/5 border-l-4 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <span>🛍️</span> Lịch sử đơn hàng
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 text-left text-xs uppercase font-extrabold tracking-wider ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-blue-600/15 to-indigo-600/5 border-l-4 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <span>📦</span> Quản lý sản phẩm
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 text-left text-xs uppercase font-extrabold tracking-wider ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-blue-600/15 to-indigo-600/5 border-l-4 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <span>📁</span> Quản lý danh mục
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className='p-4 border-t border-slate-800/50 space-y-2'>
          <Link
            to='/'
            className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-bold'
          >
            ← Về trang chủ
          </Link>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT AREA
          ========================================== */}
      <main className='flex-1 p-8 overflow-y-auto max-h-screen relative'>
        
        {/* Header bar */}
        <header className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 pb-6 mb-8'>
          <div>
            <span className='text-[10px] text-blue-500 font-extrabold uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/10'>
              {activeTab === 'orders' ? 'Đơn hàng' : activeTab === 'products' ? 'Sản phẩm' : 'Danh mục'}
            </span>
            <h1 className='text-2xl font-black text-white uppercase tracking-tight mt-3'>
              {activeTab === 'orders' && 'Danh sách đơn hàng'}
              {activeTab === 'products' && 'Quản lý kho hàng'}
              {activeTab === 'categories' && 'Danh mục sản phẩm'}
            </h1>
            <p className='text-xs text-slate-400 mt-1 font-medium'>
              {activeTab === 'orders' && 'Theo dõi, xác nhận và cập nhật trạng thái đơn hàng của người dùng.'}
              {activeTab === 'products' && 'Xem danh sách, thêm mới, điều chỉnh giá, thay đổi tồn kho và thông tin sản phẩm.'}
              {activeTab === 'categories' && 'Tạo mới, sửa tên và tổ chức lại các danh mục hàng hóa của cửa hàng.'}
            </p>
          </div>

          {/* Action button on header for Products tab */}
          {activeTab === 'products' && (
            <button
              onClick={handleOpenAddModal}
              className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs uppercase px-5 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/15 cursor-pointer flex items-center gap-2 self-start md:self-auto'
            >
              <span>➕</span> Thêm sản phẩm mới
            </button>
          )}
        </header>

        {/* ==========================================
            TAB 1: ORDERS (DON HANG)
            ========================================== */}
        {activeTab === 'orders' && (
          <div className='space-y-6'>
            
            {/* Quick Status Stats Card Grid */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {[1, 2, 3, 4].map((status) => {
                const info = STATUS_LABELS[status]
                const count = groupedOrders[status]?.length || 0
                const isSelected = orderStatusFilter === status
                return (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(isSelected ? 'all' : status)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group select-none ${
                      isSelected
                        ? 'bg-slate-900 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700/60'
                    }`}
                  >
                    <div
                      className='absolute right-0 top-0 w-24 h-24 rounded-full opacity-5 pointer-events-none'
                      style={{ background: info.color }}
                    />
                    <div className='text-3xl font-black tracking-tight mt-1' style={{ color: info.color }}>
                      {count}
                    </div>
                    <div className='text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5'>
                      <span className='w-1.5 h-1.5 rounded-full' style={{ background: info.color }} />
                      {info.label}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Filter controls */}
            <div className='flex items-center justify-between border-b border-slate-800/40 pb-4'>
              <span className='text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2'>
                📋 Danh sách hiển thị ({filteredOrders.length} đơn hàng)
                {orderStatusFilter !== 'all' && (
                  <button
                    onClick={() => setOrderStatusFilter('all')}
                    className='text-[10px] font-black text-rose-500 hover:text-rose-600 underline uppercase ml-2 cursor-pointer'
                  >
                    Hủy lọc
                  </button>
                )}
              </span>
            </div>

            {/* Orders list */}
            <div className='space-y-4'>
              {filteredOrders.map((order: any) => {
                const info = STATUS_LABELS[order.status]
                return (
                  <div
                    key={order._id}
                    className='bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:bg-slate-900/60 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group shadow-sm hover:shadow-md'
                  >
                    {/* Status accent side bar */}
                    <div
                      className='absolute left-0 top-0 bottom-0 w-1 pointer-events-none'
                      style={{ background: info?.color }}
                    />

                    {/* Left: Product & Buyer Info */}
                    <div className='flex gap-4 items-start flex-1 min-w-0'>
                      <img
                        src={order.product?.image}
                        alt={order.product?.name}
                        className='w-16 h-16 object-contain rounded-xl bg-slate-950/80 p-2 border border-slate-800/80 flex-shrink-0'
                      />
                      <div className='min-w-0 flex-1'>
                        <span className='text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block border border-slate-800 tracking-wider mb-2' style={{ color: info?.color, background: info?.bg }}>
                          {info?.label}
                        </span>
                        <h4 className='text-xs font-black text-white hover:text-blue-400 transition-colors line-clamp-1'>
                          {order.product?.name}
                        </h4>
                        <div className='text-[11px] text-slate-400 mt-2 space-y-1 font-medium'>
                          <p className='flex items-center gap-1.5'>
                            👤 <span className='text-slate-300 font-semibold'>{order.user?.name || 'Khách hàng'}</span> &nbsp;|&nbsp; ✉️ {order.user?.email}
                          </p>
                          <p className='text-slate-500'>
                            🕐 Đặt hàng: {formatDate(order.updated_at || order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Quantity & Price */}
                    <div className='flex items-center gap-8 justify-between lg:justify-end border-t lg:border-t-0 border-slate-800/40 pt-4 lg:pt-0'>
                      <div className='text-center lg:text-right min-w-[100px]'>
                        <span className='text-[10px] text-slate-500 font-bold uppercase tracking-widest block'>Số lượng</span>
                        <span className='text-xs font-black text-slate-300 block mt-1'>x{order.buy_count}</span>
                      </div>

                      <div className='text-right min-w-[140px]'>
                        <span className='text-[10px] text-slate-500 font-bold uppercase tracking-widest block'>Tổng tiền</span>
                        <span className='text-sm font-black text-rose-500 block mt-1'>
                          {formatPrice(order.product?.price * order.buy_count)}
                        </span>
                        {order.product?.price_before_discount > order.product?.price && (
                          <span className='text-[10px] text-slate-500 line-through block mt-0.5'>
                            {formatPrice(order.product?.price_before_discount * order.buy_count)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className='flex gap-2 justify-end lg:justify-center border-t lg:border-t-0 border-slate-800/40 pt-4 lg:pt-0 flex-shrink-0 min-w-[200px]'>
                      {STATUS_ACTIONS[order.status]?.map((action) => (
                        <button
                          key={action.next}
                          onClick={() =>
                            updateStatusMutation.mutate({ id: order._id, status: action.next })
                          }
                          disabled={updateStatusMutation.isLoading}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer ${action.color} text-white disabled:opacity-50`}
                        >
                          {action.label}
                        </button>
                      ))}
                      {STATUS_ACTIONS[order.status]?.length === 0 && (
                        <span className='text-[10px] text-slate-500 font-extrabold uppercase tracking-widest italic py-2.5'>
                          Không có thao tác khả dụng
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}

              {filteredOrders.length === 0 && (
                <div className='bg-slate-900/20 border border-slate-800/60 rounded-3xl p-16 text-center shadow-sm select-none'>
                  <div className='w-16 h-16 bg-slate-800/50 text-slate-500 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner mb-4'>
                    📭
                  </div>
                  <h3 className='text-xs font-extrabold uppercase text-slate-400 tracking-wider'>Không có đơn hàng</h3>
                  <p className='text-slate-500 font-medium text-xs max-w-sm mx-auto mt-2 leading-relaxed'>
                    Không tìm thấy bất kỳ đơn hàng nào khớp với trạng thái đã lọc hiện tại.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: PRODUCTS (SAN PHAM)
            ========================================== */}
        {activeTab === 'products' && (
          <div className='space-y-6'>
            
            {/* Search & Filter Bar */}
            <div className='bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm'>
              <div className='relative flex-1 max-w-md'>
                <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>🔍</span>
                <input
                  type='text'
                  placeholder='Tìm kiếm sản phẩm theo tên...'
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className='w-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl py-3 pl-10 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none placeholder:text-slate-600'
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold cursor-pointer'
                  >
                    ×
                  </button>
                )}
              </div>

              <div className='text-xs font-bold text-slate-500 flex items-center gap-2'>
                Tổng số sản phẩm: <span className='text-white font-extrabold'>{filteredProducts.length}</span>
              </div>
            </div>

            {/* Table layout (Dark UI Premium) */}
            <div className='bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm'>
              <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='bg-[#0b0f19] border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest select-none'>
                      <th className='py-4 px-5 w-[80px]'>Ảnh</th>
                      <th className='py-4 px-4'>Thông tin sản phẩm</th>
                      <th className='py-4 px-4 w-[160px] text-right'>Giá bán</th>
                      <th className='py-4 px-4 w-[120px] text-center'>Tồn kho</th>
                      <th className='py-4 px-4 w-[100px] text-center'>Đã bán</th>
                      <th className='py-4 px-5 w-[140px] text-center'>Hành động</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-800/40 text-xs font-semibold text-slate-300'>
                    {filteredProducts.map((product: any) => {
                      const inStock = product.quantity > 0
                      const categoryName = categories.find((c: any) => c._id === (product.category?._id || product.category))?.name || 'Chưa phân loại'
                      return (
                        <tr key={product._id} className='hover:bg-slate-900/40 transition-colors group'>
                          <td className='py-4 px-5'>
                            <img
                              src={product.image}
                              alt={product.name}
                              className='w-12 h-12 object-contain bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 group-hover:scale-105 transition-transform duration-300'
                            />
                          </td>
                          <td className='py-4 px-4 max-w-[320px]'>
                            <h4 className='font-black text-white hover:text-blue-400 transition-colors line-clamp-1' title={product.name}>
                              {product.name}
                            </h4>
                            <span className='inline-block bg-slate-800 text-[9px] font-extrabold text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50 mt-1.5 uppercase tracking-wide'>
                              {categoryName}
                            </span>
                          </td>
                          <td className='py-4 px-4 text-right'>
                            <div className='font-black text-white'>{formatPrice(product.price)}</div>
                            {product.price_before_discount > product.price && (
                              <div className='text-[10px] text-slate-500 line-through mt-0.5'>
                                {formatPrice(product.price_before_discount)}
                              </div>
                            )}
                          </td>
                          <td className='py-4 px-4 text-center'>
                            {inStock ? (
                              <span className='font-bold text-slate-200 bg-slate-800/80 border border-slate-700/40 px-3 py-1 rounded-xl'>
                                {product.quantity}
                              </span>
                            ) : (
                              <span className='font-black text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-xl uppercase text-[9px] tracking-wider select-none'>
                                Hết hàng
                              </span>
                            )}
                          </td>
                          <td className='py-4 px-4 text-center font-bold text-slate-400'>
                            {product.sold || 0}
                          </td>
                          <td className='py-4 px-5'>
                            <div className='flex items-center gap-1.5 justify-center'>
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className='w-9 h-9 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer border border-blue-500/10 hover:border-transparent'
                                title='Chỉnh sửa sản phẩm'
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id, product.name)}
                                className='w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer border border-rose-500/10 hover:border-transparent'
                                title='Xóa sản phẩm'
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className='bg-slate-900/20 rounded-3xl p-16 text-center select-none'>
                  <div className='w-16 h-16 bg-slate-800/50 text-slate-500 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner mb-4'>
                    🔎
                  </div>
                  <h3 className='text-xs font-extrabold uppercase text-slate-400 tracking-wider'>Không tìm thấy sản phẩm</h3>
                  <p className='text-slate-500 font-medium text-xs max-w-sm mx-auto mt-2 leading-relaxed'>
                    Chúng tôi không tìm thấy bất kỳ sản phẩm nào phù hợp với từ khóa tìm kiếm của bạn.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: CATEGORIES (DANH MUC)
            ========================================== */}
        {activeTab === 'categories' && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
            
            {/* Left Column: Add Category Form */}
            <div className='bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-sm'>
              <h3 className='text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2'>
                📂 Thêm danh mục mới
              </h3>
              <form onSubmit={handleAddCategorySubmit} className='space-y-4'>
                <div>
                  <label className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2'>
                    Tên danh mục *
                  </label>
                  <input
                    type='text'
                    placeholder='Nhập tên danh mục mới...'
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className='w-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none placeholder:text-slate-600'
                  />
                </div>
                <button
                  type='submit'
                  disabled={createCategoryMutation.isLoading}
                  className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs uppercase py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/15 cursor-pointer disabled:opacity-50'
                >
                  {createCategoryMutation.isLoading ? 'Đang thêm...' : 'Thêm danh mục'}
                </button>
              </form>
            </div>

            {/* Right Columns: Categories List Table */}
            <div className='lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4'>
              <h3 className='text-sm font-black text-white uppercase tracking-wider flex items-center gap-2'>
                📋 Danh mục hiện tại ({categories.length})
              </h3>
              
              <div className='border border-slate-800/60 rounded-2xl overflow-hidden'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='bg-[#0b0f19] border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest select-none'>
                      <th className='py-3.5 px-4'>Tên danh mục</th>
                      <th className='py-3.5 px-4 w-[160px] text-center'>Hành động</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-800/40 text-xs font-semibold text-slate-300'>
                    {categories.map((category: any) => {
                      const isEditing = editingCategoryId === category._id
                      return (
                        <tr key={category._id} className='hover:bg-slate-900/20 transition-colors'>
                          <td className='py-3 px-4'>
                            {isEditing ? (
                              <input
                                type='text'
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className='w-full max-w-sm bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-lg py-1.5 px-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none'
                                autoFocus
                              />
                            ) : (
                              <span className='font-bold text-white'>{category.name}</span>
                            )}
                          </td>
                          <td className='py-3 px-4'>
                            <div className='flex items-center gap-1.5 justify-center'>
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveCategory(category._id)}
                                    disabled={updateCategoryMutation.isLoading}
                                    className='px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase transition cursor-pointer disabled:opacity-50'
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={() => setEditingCategoryId(null)}
                                    className='px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] uppercase transition cursor-pointer'
                                  >
                                    Hủy
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleStartEditCategory(category._id, category.name)}
                                    className='w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer border border-blue-500/10 hover:border-transparent'
                                    title='Sửa tên danh mục'
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(category._id, category.name)}
                                    className='w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer border border-rose-500/10 hover:border-transparent'
                                    title='Xóa danh mục'
                                  >
                                    🗑️
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}

                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={2} className='py-8 text-center text-slate-500 italic'>
                          Chưa có danh mục nào được khởi tạo
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==========================================
          MODAL: ADD / EDIT PRODUCT
          ========================================== */}
      {isProductModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in'>
          <div className='bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up'>
            
            {/* Modal Header */}
            <div className='p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40'>
              <h3 className='text-sm font-black text-white uppercase tracking-wider flex items-center gap-2'>
                {editingProduct ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
              </h3>
              <button
                onClick={handleCloseProductModal}
                className='text-slate-400 hover:text-white text-2xl transition leading-none cursor-pointer p-1 font-semibold select-none'
              >
                ×
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleProductSubmit} className='p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
              
              {/* Product Name */}
              <div>
                <label className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2'>
                  Tên sản phẩm *
                </label>
                <input
                  type='text'
                  required
                  placeholder='Nhập tên sản phẩm...'
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  className='w-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none placeholder:text-slate-600'
                />
              </div>

              {/* Price & Price before discount */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2'>
                    Giá bán * (VND)
                  </label>
                  <input
                    type='number'
                    required
                    placeholder='Nhập giá bán...'
                    value={productForm.price}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                    className='w-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none placeholder:text-slate-600'
                  />
                </div>

                <div>
                  <label className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2'>
                    Giá gốc trước giảm giá (VND)
                  </label>
                  <input
                    type='number'
                    placeholder='Nhập giá gốc trước giảm...'
                    value={productForm.price_before_discount}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, price_before_discount: e.target.value }))}
                    className='w-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none placeholder:text-slate-600'
                  />
                </div>
              </div>

              {/* Quantity & Category */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2'>
                    Số lượng trong kho *
                  </label>
                  <input
                    type='number'
                    required
                    placeholder='Nhập số lượng tồn...'
                    value={productForm.quantity}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, quantity: e.target.value }))}
                    className='w-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none placeholder:text-slate-600'
                  />
                </div>

                <div>
                  <label className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2'>
                    Danh mục sản phẩm *
                  </label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, category_id: e.target.value }))}
                    className='w-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none'
                  >
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id} className='bg-[#0b0f19]'>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image upload field & preview */}
              <div>
                <label className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2'>
                  Ảnh sản phẩm *
                </label>
                
                <div className='flex flex-col sm:flex-row gap-4 items-start'>
                  {/* Selected image preview */}
                  <div className='w-28 h-28 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center p-2 overflow-hidden flex-shrink-0 relative group'>
                    {productForm.image ? (
                      <img
                        src={productForm.image}
                        alt='Preview'
                        className='max-h-full max-w-full object-contain'
                      />
                    ) : (
                      <span className='text-[10px] text-slate-600 uppercase font-black text-center px-2 select-none'>
                        Chưa có ảnh
                      </span>
                    )}

                    {isUploading && (
                      <div className='absolute inset-0 bg-slate-950/70 flex items-center justify-center'>
                        <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                      </div>
                    )}
                  </div>

                  {/* Upload input button */}
                  <div className='flex-1 w-full space-y-2'>
                    <label className='inline-flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-black text-xs uppercase px-4 py-2.5 rounded-xl transition cursor-pointer select-none'>
                      📁 Chọn và tải ảnh lên server
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='hidden'
                      />
                    </label>
                    
                    <p className='text-[10px] text-slate-500 font-medium leading-relaxed'>
                      Chấp nhận tất cả định dạng ảnh phổ biến (PNG, JPG, JPEG, WEBP) dung lượng dưới 1MB. Ảnh tải lên sẽ được lưu trữ tự động trên máy chủ.
                    </p>

                    {productForm.image && (
                      <div className='text-[10px] text-slate-400 font-mono break-all line-clamp-1'>
                        Đường dẫn: {productForm.image}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description text area */}
              <div>
                <label className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2'>
                  Mô tả chi tiết sản phẩm
                </label>
                <textarea
                  placeholder='Nhập mô tả sản phẩm...'
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  className='w-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all outline-none placeholder:text-slate-600 resize-y'
                />
              </div>

              {/* Modal Footer / Form Buttons */}
              <div className='pt-6 border-t border-slate-800/80 flex items-center justify-end gap-3'>
                <button
                  type='button'
                  onClick={handleCloseProductModal}
                  className='px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs uppercase transition cursor-pointer'
                >
                  Hủy bỏ
                </button>
                <button
                  type='submit'
                  disabled={createProductMutation.isLoading || updateProductMutation.isLoading || isUploading}
                  className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs uppercase px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/15 cursor-pointer disabled:opacity-50'
                >
                  {createProductMutation.isLoading || updateProductMutation.isLoading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
