import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPurchases, buyPurchases, deletePurchases, updatePurchase } from '../../api/purchase.api'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import { formatVND, resolveImageUrl } from '../../utils/utils'

const STATUS_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Chờ xác nhận', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5', bg: 'bg-amber-500' },
  2: { label: 'Đang xử lý', color: 'text-blue-500 border-blue-500/20 bg-blue-500/5', bg: 'bg-blue-500' },
  3: { label: 'Đã giao', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5', bg: 'bg-emerald-500' },
  4: { label: 'Đã hủy', color: 'text-rose-500 border-rose-500/20 bg-rose-500/5', bg: 'bg-rose-500' }
}

export default function Bills() {
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart')
  const [historyFilter, setHistoryFilter] = useState<'all' | 1 | 2 | 3 | 4>('all')
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([])
  
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    recipient_name: '',
    phone_number: '',
    shipping_address: ''
  })
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const profileStr = localStorage.getItem('profile')
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr)
        setCheckoutForm({
          recipient_name: profile.name || '',
          phone_number: profile.phone || '',
          shipping_address: profile.address || ''
        })
      } catch (e) {}
    }
  }, [])

  // ==========================================
  // 1. DATA FETCHING (REACT QUERY)
  // ==========================================

  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: ['purchases', 0],
    queryFn: () => getPurchases({ status: 0 })
  })
  const cartItems = cartData?.data?.result || []

  const { data: waitingData } = useQuery({
    queryKey: ['purchases', 1],
    queryFn: () => getPurchases({ status: 1 })
  })
  const waitingItems = waitingData?.data?.result || []

  const { data: processingData } = useQuery({
    queryKey: ['purchases', 2],
    queryFn: () => getPurchases({ status: 2 })
  })
  const processingItems = processingData?.data?.result || []

  const { data: deliveredData } = useQuery({
    queryKey: ['purchases', 3],
    queryFn: () => getPurchases({ status: 3 })
  })
  const deliveredItems = deliveredData?.data?.result || []

  const { data: cancelledData } = useQuery({
    queryKey: ['purchases', 4],
    queryFn: () => getPurchases({ status: 4 })
  })
  const cancelledItems = cancelledData?.data?.result || []

  // ==========================================
  // 2. MUTATIONS
  // ==========================================

  const updatePurchaseMutation = useMutation({
    mutationFn: (data: { id: string; buy_count: number }) => updatePurchase(data.id, { buy_count: data.buy_count }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
    },
    onError: () => toast.error('Không thể cập nhật số lượng!')
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: (ids: string[]) => deletePurchases({ purchase_ids: ids }),
    onSuccess: (_, ids) => {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!')
      setSelectedCartIds((prev) => prev.filter((id) => !ids.includes(id)))
      queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
    },
    onError: () => toast.error('Xóa thất bại!')
  })

  const buyPurchaseMutation = useMutation({
    mutationFn: (data: { purchase_ids: string[], recipient_name: string, phone_number: string, shipping_address: string }) => buyPurchases(data),
    onSuccess: () => {
      toast.success('Đặt hàng thành công! Đơn hàng đang được chờ xác nhận.')
      setSelectedCartIds([])
      queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
      queryClient.invalidateQueries({ queryKey: ['purchases', 1] })
      setIsQrModalOpen(false)
      setActiveTab('history')
      setHistoryFilter(1)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại!')
    }
  })

  // ==========================================
  // 3. COMPUTED STATES & HANDLERS
  // ==========================================

  const handleSelectAll = () => {
    if (selectedCartIds.length === cartItems.length) {
      setSelectedCartIds([])
    } else {
      setSelectedCartIds(cartItems.map((item: any) => item._id))
    }
  }

  const handleSelectToggle = (id: string) => {
    setSelectedCartIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const totalCartValue = useMemo(() => {
    return cartItems.reduce((acc: number, item: any) => {
      if (selectedCartIds.includes(item._id)) {
        return acc + (item.product?.price || 0) * item.buy_count
      }
      return acc
    }, 0)
  }, [cartItems, selectedCartIds])

  const allHistoryItems = useMemo(() => {
    const combined = [
      ...waitingItems.map((item: any) => ({ ...item, status: 1 })),
      ...processingItems.map((item: any) => ({ ...item, status: 2 })),
      ...deliveredItems.map((item: any) => ({ ...item, status: 3 })),
      ...cancelledItems.map((item: any) => ({ ...item, status: 4 }))
    ]
    return combined.sort((a: any, b: any) => new Date(b.updated_at || b.createdAt).getTime() - new Date(a.updated_at || a.createdAt).getTime())
  }, [waitingItems, processingItems, deliveredItems, cancelledItems])

  const filteredHistoryItems = useMemo(() => {
    if (historyFilter === 'all') return allHistoryItems
    return allHistoryItems.filter((item: any) => item.status === historyFilter)
  }, [allHistoryItems, historyFilter])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('vi-VN')

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCartIds.length === 0) return
    setIsCheckoutModalOpen(false)
    setIsQrModalOpen(true)
  }

  const handleConfirmQrPayment = () => {
    buyPurchaseMutation.mutate({
      purchase_ids: selectedCartIds,
      recipient_name: checkoutForm.recipient_name,
      phone_number: checkoutForm.phone_number,
      shipping_address: checkoutForm.shipping_address
    })
  }

  return (
    <div className='min-h-screen bg-slate-50/60 font-sans p-6'>
      
      {/* Navigation Breadcrumb */}
      <nav className='max-w-4xl mx-auto flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6 select-none'>
        <Link to='/' className='hover:text-blue-600 transition'>Home</Link>
        <span>/</span>
        <span className='text-slate-900 font-black'>Hóa đơn & Giỏ hàng</span>
      </nav>

      {/* Main Container */}
      <div className='max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden'>
        
        {/* Navigation big Tabs */}
        <div className='flex border-b border-slate-100 bg-slate-50/80 p-2 gap-2 select-none'>
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex-1 py-4.5 rounded-2xl text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'cart'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-700 hover:bg-white/40'
            }`}
          >
            🛒 Giỏ hàng của tôi
            {cartItems.length > 0 && (
              <span className='bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full'>
                {cartItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4.5 rounded-2xl text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-700 hover:bg-white/40'
            }`}
          >
            📋 Lịch sử đơn mua
            {allHistoryItems.length > 0 && (
              <span className='bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-full'>
                {allHistoryItems.length}
              </span>
            )}
          </button>
        </div>

        <div className='p-6 md:p-8'>
          {/* ==========================================
              TAB 1: CART (GIO HANG)
              ========================================== */}
          {activeTab === 'cart' && (
            <div className='space-y-6'>
              
              {/* Select All & Delete Group */}
              {cartItems.length > 0 && (
                <div className='flex items-center justify-between border-b border-slate-100 pb-4 select-none'>
                  <label className='flex items-center gap-2.5 text-xs font-bold text-slate-600 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={selectedCartIds.length === cartItems.length && cartItems.length > 0}
                      onChange={handleSelectAll}
                      className='w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer'
                    />
                    Chọn tất cả ({cartItems.length} sản phẩm)
                  </label>

                  {selectedCartIds.length > 0 && (
                    <button
                      onClick={() => deletePurchaseMutation.mutate(selectedCartIds)}
                      className='text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer transition hover:underline'
                    >
                      🗑️ Xóa mục đã chọn ({selectedCartIds.length})
                    </button>
                  )}
                </div>
              )}

              {/* Cart List */}
              <div className='space-y-4'>
                {cartItems.map((item: any) => {
                  const isChecked = selectedCartIds.includes(item._id)
                  const isMutating = updatePurchaseMutation.isLoading && updatePurchaseMutation.variables?.id === item._id

                  return (
                    <div
                      key={item._id}
                      className={`rounded-2xl border p-4.5 flex items-center gap-4 transition-all duration-300 ${
                        isChecked
                          ? 'border-blue-500/30 bg-blue-50/5 shadow-sm'
                          : 'border-slate-250/60 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={isChecked}
                        onChange={() => handleSelectToggle(item._id)}
                        className='w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer flex-shrink-0'
                      />

                      <img
                        src={resolveImageUrl(item.product?.image)}
                        alt={item.product?.name}
                        className='w-16 h-16 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1 flex-shrink-0'
                        onError={(e) => { (e.target as HTMLImageElement).src = resolveImageUrl() }}
                      />

                      <div className='flex-1 min-w-0'>
                        <h4 className='font-bold text-slate-800 line-clamp-1 text-sm' title={item.product?.name}>
                          {item.product?.name}
                        </h4>
                        <span className='font-black text-rose-600 mt-2 block text-sm'>
                          {formatVND(item.product?.price)}
                        </span>
                      </div>

                      <div className='flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50 select-none relative'>
                        <button
                          disabled={item.buy_count <= 1 || isMutating}
                          onClick={() => updatePurchaseMutation.mutate({ id: item._id, buy_count: item.buy_count - 1 })}
                          className='w-7 h-7 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-600 disabled:opacity-50 transition border border-slate-150 cursor-pointer'
                        >
                          -
                        </button>
                        
                        <span className='w-8 text-center text-xs font-extrabold text-slate-700 min-w-[20px]'>
                          {item.buy_count}
                        </span>

                        <button
                          disabled={isMutating}
                          onClick={() => updatePurchaseMutation.mutate({ id: item._id, buy_count: item.buy_count + 1 })}
                          className='w-7 h-7 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-600 disabled:opacity-50 transition border border-slate-150 cursor-pointer'
                        >
                          +
                        </button>

                        {isMutating && (
                          <div className='absolute inset-0 bg-slate-100/50 flex items-center justify-center rounded-xl'>
                            <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => deletePurchaseMutation.mutate([item._id])}
                        className='text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-wider cursor-pointer transition p-2'
                        title='Xóa khỏi giỏ hàng'
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}

                {cartItems.length === 0 && !isCartLoading && (
                  <div className='text-center py-16 select-none'>
                    <div className='w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner mb-4'>
                      🛒
                    </div>
                    <h3 className='text-xs font-extrabold uppercase text-slate-600 tracking-wider'>Giỏ hàng trống</h3>
                    <p className='text-slate-400 font-medium text-xs max-w-sm mx-auto mt-2 leading-relaxed'>
                      Giỏ hàng của bạn đang trống. Hãy quay lại trang sản phẩm để chọn mua món đồ bạn yêu thích nhé!
                    </p>
                    <Link
                      to='/products'
                      className='mt-6 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md'
                    >
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className='bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 shadow-sm select-none'>
                  <div>
                    <span className='text-slate-500 block text-xs font-semibold'>Tổng thanh toán ({selectedCartIds.length} sản phẩm):</span>
                    <span className='text-2xl font-black text-rose-600 block mt-1'>
                      {formatVND(totalCartValue)}
                    </span>
                  </div>
                  <button
                    disabled={selectedCartIds.length === 0 || buyPurchaseMutation.isLoading}
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className='w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider py-4 px-10 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition duration-300'
                  >
                    THANH TOÁN NGAY
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              TAB 2: HISTORY (DON HANG DA DAT)
              ========================================== */}
          {activeTab === 'history' && (
            <div className='space-y-6'>
              
              <div className='flex gap-1 overflow-x-auto border-b border-slate-100 pb-2 select-none max-w-full scrollbar-none'>
                {[
                  { key: 'all', label: 'Tất cả đơn' },
                  { key: 1, label: '⏳ Chờ xác nhận' },
                  { key: 2, label: '📦 Đang xử lý' },
                  { key: 3, label: '🚚 Đã giao' },
                  { key: 4, label: '❌ Đã hủy' }
                ].map((tab) => {
                  const isSelected = historyFilter === tab.key
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setHistoryFilter(tab.key as any)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-600 font-extrabold'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <div className='space-y-4'>
                {filteredHistoryItems.map((item: any) => {
                  const info = STATUS_LABELS[item.status]
                  return (
                    <div
                      key={item._id}
                      className='bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4.5 gap-4 relative group'
                    >
                      <div className='flex gap-4 items-start flex-1 min-w-0'>
                        <img
                          src={resolveImageUrl(item.product?.image)}
                          alt={item.product?.name}
                          className='w-14 h-14 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1 flex-shrink-0'
                          onError={(e) => { (e.target as HTMLImageElement).src = resolveImageUrl() }}
                        />
                        <div className='min-w-0 flex-1'>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wide mb-2 ${info?.color}`}>
                            <span className={`w-1 h-1 rounded-full ${info?.bg}`} />
                            {info?.label}
                          </span>
                          
                          <h4 className='font-bold text-slate-800 line-clamp-1 text-sm'>
                            {item.product?.name}
                          </h4>
                          
                          <p className='text-[10px] text-slate-400 font-medium mt-1.5'>
                            Đặt ngày: {formatDate(item.updated_at || item.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 pt-3.5 md:pt-0'>
                        <div className='text-left md:text-right min-w-[70px]'>
                          <span className='text-[9px] text-slate-400 font-bold uppercase tracking-wider block'>Số lượng</span>
                          <span className='text-xs font-extrabold text-slate-700 block mt-0.5'>x{item.buy_count}</span>
                        </div>

                        <div className='text-right min-w-[120px]'>
                          <span className='text-[9px] text-slate-400 font-bold uppercase tracking-wider block'>Tổng thanh toán</span>
                          <span className='text-sm font-black text-rose-600 block mt-0.5'>
                            {formatVND(item.product?.price * item.buy_count)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredHistoryItems.length === 0 && (
                  <div className='text-center py-16 select-none'>
                    <div className='w-16 h-16 bg-slate-50 text-slate-450 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner mb-4'>
                      📋
                    </div>
                    <h3 className='text-xs font-extrabold uppercase text-slate-500 tracking-wider'>Không có đơn mua</h3>
                    <p className='text-slate-400 font-medium text-xs max-w-sm mx-auto mt-2 leading-relaxed'>
                      Bạn không có đơn hàng nào ở trạng thái này.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Thông tin nhận hàng</h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="text-white hover:text-blue-200 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên người nhận <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={checkoutForm.recipient_name}
                  onChange={e => setCheckoutForm({...checkoutForm, recipient_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  required
                  value={checkoutForm.phone_number}
                  onChange={e => setCheckoutForm({...checkoutForm, phone_number: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={3}
                  value={checkoutForm.shipping_address}
                  onChange={e => setCheckoutForm({...checkoutForm, shipping_address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none" 
                  placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4 flex justify-between items-center border border-gray-100">
                <span className="font-medium text-gray-600">Tổng thanh toán:</span>
                <span className="font-bold text-rose-600 text-lg">
                  {formatVND(totalCartValue)}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md transition cursor-pointer"
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in'>
          <div className='bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-up border border-slate-100 p-6 text-center font-sans'>
            <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-xl'>
              🔒
            </div>
            <h3 className='text-slate-800 font-black text-base uppercase tracking-tight mb-1'>Thanh toán đơn hàng</h3>
            <p className='text-xs text-slate-400 font-medium mb-4'>Quét mã VietQR dưới đây để thanh toán</p>
            
            <div className='bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-[200px] mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-inner'>
              <img
                src={`https://img.vietqr.io/image/MB-0987654321-compact.png?amount=${totalCartValue}&addInfo=PCSTORE%2520THANH%2520TOAN`}
                alt='VietQR Payment'
                className='max-h-full max-w-full object-contain rounded-lg'
              />
            </div>

            <div className='space-y-1 mb-6'>
              <span className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block'>Số tiền cần trả</span>
              <span className='text-xl font-black text-rose-500 block'>{formatVND(totalCartValue)}</span>
              <span className='text-[10px] text-slate-400 font-bold block mt-1.5 bg-slate-100 py-1 px-3 rounded-full inline-block'>
                Nội dung: PCSTORE THANH TOAN
              </span>
            </div>

            <p className='text-[10px] text-slate-400 font-semibold leading-relaxed mb-6 bg-amber-50 text-amber-600 border border-amber-200/50 rounded-xl p-3.5'>
              ⚠️ Sau khi quét mã và chuyển khoản thành công trên ứng dụng ngân hàng, bạn vui lòng nhấn "Tôi đã chuyển khoản" để hệ thống ghi nhận đơn hàng.
            </p>

            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => setIsQrModalOpen(false)}
                className='flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer'
              >
                Hủy bỏ
              </button>
              <button
                type='button'
                disabled={buyPurchaseMutation.isLoading}
                onClick={handleConfirmQrPayment}
                className='flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/10 cursor-pointer transition disabled:opacity-50'
              >
                {buyPurchaseMutation.isLoading ? 'Đang đặt...' : 'Tôi đã chuyển'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
