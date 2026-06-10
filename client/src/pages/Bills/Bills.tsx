import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPurchases, buyPurchases, deletePurchases, updatePurchase } from '../../api/purchase.api'
import { toast } from 'react-toastify'
import { Link } from 'react-router'

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
  const [isShippingOpen, setIsShippingOpen] = useState(false)
  const [isDiscountOpen, setIsDiscountOpen] = useState(false)
  
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-US')

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
    <div className='min-h-screen bg-white font-sans px-4 py-8 mb-12'>
      <div className='max-w-7xl mx-auto'>
        {/* Navigation Breadcrumb */}
        <nav className='flex items-center gap-1.5 text-xs text-dark opacity-70 mb-8'>
          <Link to='/' className='hover:text-primary transition'>Home</Link>
          <span className='opacity-50'>›</span>
          <span className='font-medium text-dark'>Shopping Cart</span>
        </nav>

        {/* Navigation big Tabs */}
        <div className='flex border-b border-gray-200 mb-8 gap-8'>
          <button
            onClick={() => setActiveTab('cart')}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'cart'
                ? 'border-primary text-dark'
                : 'border-transparent text-gray-400 hover:text-dark'
            }`}
          >
            Shopping Cart
            {cartItems.length > 0 && (
              <span className='ml-2 text-xs opacity-70'>({cartItems.length})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'history'
                ? 'border-primary text-dark'
                : 'border-transparent text-gray-400 hover:text-dark'
            }`}
          >
            Order History
            {allHistoryItems.length > 0 && (
              <span className='ml-2 text-xs opacity-70'>({allHistoryItems.length})</span>
            )}
          </button>
        </div>

        <div>
          {activeTab === 'cart' && (
            <div>
              <h1 className='text-[32px] font-light text-dark mb-8'>Shopping Cart</h1>
              
              <div className='flex flex-col lg:flex-row gap-8'>
                {/* Left Column: Cart Items */}
                <div className='flex-1'>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                      <thead>
                        <tr className='border-b border-gray-200 text-sm font-semibold text-dark'>
                          <th className='pb-4 font-bold'>Item</th>
                          <th className='pb-4 font-bold'>Price</th>
                          <th className='pb-4 font-bold'>Qty</th>
                          <th className='pb-4 font-bold text-right'>Subtotal</th>
                          <th className='pb-4'></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item: any) => {
                          const isMutating = updatePurchaseMutation.isLoading && updatePurchaseMutation.variables?.id === item._id;
                          return (
                            <tr key={item._id} className='border-b border-gray-200'>
                              <td className='py-6 pr-4'>
                                <div className='flex items-center gap-6'>
                                  <img
                                    src={item.product?.image}
                                    alt={item.product?.name}
                                    className='w-24 h-24 object-contain shrink-0'
                                  />
                                  <div className='max-w-xs'>
                                    <h4 className='font-semibold text-dark text-sm leading-relaxed'>{item.product?.name}</h4>
                                  </div>
                                </div>
                              </td>
                              <td className='py-6 text-dark font-bold whitespace-nowrap'>
                                {formatPrice(item.product?.price)}
                              </td>
                              <td className='py-6'>
                                <div className='flex items-center gap-1 bg-gray-100 rounded px-3 py-2 w-max'>
                                  <span className='w-6 text-center text-sm font-semibold'>{item.buy_count}</span>
                                  <div className='flex flex-col gap-1'>
                                    <button disabled={isMutating} onClick={() => updatePurchaseMutation.mutate({ id: item._id, buy_count: item.buy_count + 1 })} className='cursor-pointer text-gray-500 hover:text-dark'>
                                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 15l7-7 7 7'/></svg>
                                    </button>
                                    <button disabled={item.buy_count <= 1 || isMutating} onClick={() => updatePurchaseMutation.mutate({ id: item._id, buy_count: item.buy_count - 1 })} className='cursor-pointer text-gray-500 hover:text-dark'>
                                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M19 9l-7 7-7-7'/></svg>
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className='py-6 text-dark font-bold text-right whitespace-nowrap'>
                                {formatPrice(item.product?.price * item.buy_count)}
                              </td>
                              <td className='py-6 text-right pl-4'>
                                <div className='flex flex-col items-end gap-2'>
                                  <button onClick={() => deletePurchaseMutation.mutate([item._id])} className='w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer'>
                                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/></svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {cartItems.length === 0 && !isCartLoading && (
                    <div className='text-center py-12'>
                      <p className='text-gray-500 mb-6'>Your shopping cart is empty.</p>
                      <Link to='/products' className='px-8 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors'>
                        Continue Shopping
                      </Link>
                    </div>
                  )}

                  {cartItems.length > 0 && (
                    <div className='flex flex-wrap items-center justify-between mt-8 gap-4'>
                      <div className='flex flex-wrap gap-4'>
                        <Link to='/products' className='px-8 py-3 rounded-full border-2 border-gray-300 text-gray-600 font-bold text-sm hover:border-gray-400 transition-colors'>
                          Continue Shopping
                        </Link>
                        <button onClick={() => deletePurchaseMutation.mutate(cartItems.map((i:any)=>i._id))} className='px-8 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer'>
                          Clear Shopping Cart
                        </button>
                      </div>
                      <button className='px-8 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer'>
                        Update Shopping Cart
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Summary */}
                {cartItems.length > 0 && (
                  <div className='w-full lg:w-[350px] shrink-0'>
                    <div className='bg-slate-50 p-6 mb-4'>
                      <h2 className='text-xl font-bold text-dark mb-6'>Summary</h2>
                      
                      <div className='border-b border-gray-200 pb-4 mb-4'>
                        <button 
                          onClick={() => setIsShippingOpen(!isShippingOpen)}
                          className='w-full flex justify-between items-center text-sm font-semibold text-dark mb-2 cursor-pointer'
                        >
                          Estimate Shipping and Tax
                          <svg className={`w-4 h-4 text-gray-500 transition-transform ${isShippingOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
                        </button>
                        <p className='text-xs text-gray-500 mb-4'>Enter your destination to get a shipping estimate.</p>
                        
                        {isShippingOpen && (
                          <div className='space-y-4 animate-fade-in'>
                            <div>
                              <label className='block text-xs font-semibold text-dark mb-1'>Country</label>
                              <select className='w-full p-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-primary'>
                                <option>Australia</option>
                                <option>Vietnam</option>
                                <option>United States</option>
                              </select>
                            </div>
                            <div>
                              <label className='block text-xs font-semibold text-dark mb-1'>State/Province</label>
                              <input type='text' className='w-full p-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-primary' />
                            </div>
                            <div>
                              <label className='block text-xs font-semibold text-dark mb-1'>Zip/Postal Code</label>
                              <input type='text' className='w-full p-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-primary' />
                            </div>
                            <div className='pt-2'>
                              <label className='block text-xs font-semibold text-dark mb-2'>Standard Rate</label>
                              <label className='flex items-start gap-2 cursor-pointer mb-3'>
                                <input type='radio' name='shipping_rate' className='mt-0.5' defaultChecked />
                                <span className='text-xs text-dark leading-tight'>Price may vary depending on the item/destination. Shop Staff will contact you. <b>$21.00</b></span>
                              </label>
                              <label className='block text-xs font-semibold text-dark mb-2'>Pickup from store</label>
                              <label className='flex items-start gap-2 cursor-pointer'>
                                <input type='radio' name='shipping_rate' className='mt-0.5' />
                                <span className='text-xs text-dark leading-tight'>1234 Street Adress City Address, 1234 <b>$0.00</b></span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className='border-b border-gray-200 pb-4 mb-6'>
                        <button 
                          onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                          className='w-full flex justify-between items-center text-sm font-semibold text-dark cursor-pointer'
                        >
                          Apply Discount Code
                          <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDiscountOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
                        </button>
                        
                        {isDiscountOpen && (
                          <div className='mt-4 space-y-4 animate-fade-in'>
                            <div>
                              <label className='block text-xs font-semibold text-dark mb-1'>Enter discount code</label>
                              <input type='text' placeholder='Enter Discount code' className='w-full p-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-primary' />
                            </div>
                            <button className='w-full py-2.5 border-2 border-primary text-primary font-bold text-sm rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer'>
                              Apply Discount
                            </button>
                          </div>
                        )}
                      </div>

                      <div className='space-y-3 mb-6 text-sm'>
                        <div className='flex justify-between font-semibold'>
                          <span className='text-dark'>Subtotal</span>
                          <span className='text-dark'>{formatPrice(cartItems.reduce((acc:any, item:any) => acc + (item.product?.price * item.buy_count), 0))}</span>
                        </div>
                        <div className='flex justify-between font-semibold'>
                          <span className='text-dark'>Shipping</span>
                          <span className='text-dark'>{formatPrice(21000)}</span>
                        </div>
                        <p className='text-[10px] text-gray-400 mb-2 leading-tight'>(Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)</p>
                        <div className='flex justify-between font-semibold'>
                          <span className='text-dark'>Tax</span>
                          <span className='text-dark'>{formatPrice(0)}</span>
                        </div>
                        <div className='flex justify-between font-semibold'>
                          <span className='text-dark'>GST (10%)</span>
                          <span className='text-dark'>{formatPrice(cartItems.reduce((acc:any, item:any) => acc + (item.product?.price * item.buy_count), 0) * 0.1)}</span>
                        </div>
                      </div>

                      <div className='flex justify-between font-bold text-lg text-dark mb-8 border-t border-gray-200 pt-4'>
                        <span>Order Total</span>
                        <span>{formatPrice(cartItems.reduce((acc:any, item:any) => acc + (item.product?.price * item.buy_count), 0) * 1.1 + 21000)}</span>
                      </div>

                      <div className='space-y-3'>
                        <Link
                          to='/checkout'
                          className='w-full py-3.5 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary/90 transition-colors cursor-pointer text-center block'
                        >
                          Proceed to Checkout
                        </Link>
                        <button className='w-full py-3.5 bg-[#FFC439] text-[#003087] font-bold text-sm rounded-full hover:bg-[#F4B938] transition-colors cursor-pointer flex items-center justify-center gap-1'>
                          Check out with <span className='font-black italic'>PayPal</span>
                        </button>
                        <button className='w-full py-3.5 bg-transparent border-2 border-gray-300 text-gray-600 font-bold text-sm rounded-full hover:border-gray-400 transition-colors cursor-pointer'>
                          Check Out with Multiple Addresses
                        </button>
                      </div>
                    </div>
                    
                    <div className='flex items-center justify-center gap-2 mt-4'>
                      <span className='font-black text-[#6631E0] text-xl tracking-tighter'>zip</span>
                      <span className='text-gray-500 font-medium text-xs border-l border-gray-300 pl-2'>own it now, up to 6 months<br/>interest free <a href='#' className='underline'>learn more</a></span>
                    </div>
                  </div>
                )}
              </div>
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
                          src={item.product?.image}
                          alt={item.product?.name}
                          className='w-14 h-14 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1 flex-shrink-0'
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
                            {formatPrice(item.product?.price * item.buy_count)}
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
                  {formatPrice(totalCartValue)}
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
              <span className='text-xl font-black text-rose-500 block'>{formatPrice(totalCartValue)}</span>
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
