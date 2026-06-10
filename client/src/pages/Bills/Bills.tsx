import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPurchases, buyPurchases, deletePurchases, updatePurchase } from '../../api/purchase.api'
import { toast } from 'react-toastify'
import { Link } from 'react-router'

export default function Bills() {
  const queryClient = useQueryClient()
  
  const [isShippingOpen, setIsShippingOpen] = useState(false)
  const [isDiscountOpen, setIsDiscountOpen] = useState(false)
  

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

  // ==========================================
  // 2. MUTATIONS
  // ==========================================

  const updatePurchaseMutation = useMutation({
    mutationFn: (data: { id: string; buy_count: number }) => updatePurchase(data.id, { buy_count: data.buy_count }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
    },
    onError: () => toast.error('Cannot update quantity!')
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: (ids: string[]) => deletePurchases({ purchase_ids: ids }),
    onSuccess: () => {
      toast.success('Removed product from cart!')
      queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
    },
    onError: () => toast.error('Delete failed!')
  })

  const buyPurchaseMutation = useMutation({
    mutationFn: (data: { purchase_ids: string[], recipient_name: string, phone_number: string, shipping_address: string }) => buyPurchases(data),
    onSuccess: () => {
      toast.success('Order placed successfully! Your order is pending confirmation.')
      queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
      setIsQrModalOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Order failed!')
    }
  })

  // ==========================================
  // 3. COMPUTED STATES & HANDLERS
  // ==========================================

  const totalCartValue = useMemo(() => {
    return cartItems.reduce((acc: number, item: any) => acc + (item.product?.price || 0) * item.buy_count, 0)
  }, [cartItems])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0)



  const handleConfirmQrPayment = () => {
    buyPurchaseMutation.mutate({
      purchase_ids: cartItems.map((item: any) => item._id),
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

        <div>
          <h1 className='text-3xl font-bold text-dark mb-8'>Shopping Cart</h1>
          
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Left Column: Cart Items */}
            <div className='flex-1'>
              {cartItems.length > 0 ? (
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
                              <div className='flex items-center'>
                                <input 
                                  type='number'
                                  value={item.buy_count}
                                  onChange={(e) => {
                                    let val = parseInt(e.target.value)
                                    if (isNaN(val) || val < 1) return
                                    if (val > (item.product?.quantity || 1)) val = item.product?.quantity || 1
                                    updatePurchaseMutation.mutate({ id: item._id, buy_count: val })
                                  }}
                                  onBlur={(e) => {
                                    if (!e.target.value || parseInt(e.target.value) < 1) {
                                      updatePurchaseMutation.mutate({ id: item._id, buy_count: 1 })
                                    }
                                  }}
                                  className='w-16 text-center bg-gray-50 border border-gray-200 rounded px-2 py-1.5 outline-none text-sm font-semibold text-dark focus:border-primary'
                                />
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
                                <button className='w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors cursor-pointer'>
                                  <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                !isCartLoading && (
                  <div className='text-center py-20 select-none bg-white border border-slate-100 rounded-2xl'>
                    <div className='mx-auto w-24 h-24 mb-6 opacity-80'>
                      <svg viewBox="0 0 117 117" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="58.5" cy="58.5" r="58.5" fill="#F5F7FF"/>
                        <path d="M42 45H75M42 58H60M35 30H82C85.866 30 89 33.134 89 37V87C89 90.866 85.866 94 82 94H35C31.134 94 28 90.866 28 87V37C28 33.134 31.134 30 35 30Z" stroke="#0156FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold text-dark mb-2'>Cart is empty</h3>
                    <p className='text-gray-500 text-sm max-w-sm mx-auto mb-8'>
                      You haven't added any products to your cart yet. Browse our store and find something you love!
                    </p>
                    <Link to='/products' className='px-8 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors cursor-pointer inline-block'>
                      Continue Shopping
                    </Link>
                  </div>
                )
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
                      <span className='text-dark'>{formatPrice(totalCartValue)}</span>
                    </div>
                    <div className='flex justify-between font-semibold'>
                      <span className='text-dark'>Shipping</span>
                      <span className='text-dark'>{formatPrice(21)}</span>
                    </div>
                    <p className='text-[10px] text-gray-400 mb-2 leading-tight'>(Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)</p>
                    <div className='flex justify-between font-semibold'>
                      <span className='text-dark'>Tax</span>
                      <span className='text-dark'>{formatPrice(0)}</span>
                    </div>
                    <div className='flex justify-between font-semibold'>
                      <span className='text-dark'>GST (10%)</span>
                      <span className='text-dark'>{formatPrice(totalCartValue * 0.1)}</span>
                    </div>
                  </div>

                  <div className='flex justify-between font-bold text-lg text-dark mb-8 border-t border-gray-200 pt-4'>
                    <span>Order Total</span>
                    <span>{formatPrice(totalCartValue * 1.1 + (totalCartValue > 0 ? 21 : 0))}</span>
                  </div>

                  <div className='space-y-3'>
                    <Link
                      to='/checkout'
                      className='w-full py-3.5 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary/90 transition-colors cursor-pointer block text-center'
                    >
                      Proceed to Checkout
                    </Link>
                    <button className='w-full py-3.5 bg-[#FFC439] text-[#003087] font-bold text-sm rounded-full hover:bg-[#F4B938] transition-colors cursor-pointer flex items-center justify-center gap-1'>
                      Check out with <span className='font-black italic'>PayPal</span>
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
      </div>

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in'>
          <div className='bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-up border border-slate-100 p-6 text-center font-sans'>
            <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-xl'>
              🔒
            </div>
            <h3 className='text-slate-800 font-black text-base uppercase tracking-tight mb-1'>Payment</h3>
            <p className='text-xs text-slate-400 font-medium mb-4'>Scan the VietQR code below to pay</p>
            
            <div className='bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-[200px] mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-inner'>
              <img
                src={`https://img.vietqr.io/image/MB-0987654321-compact.png?amount=${totalCartValue}&addInfo=PCSTORE%2520PAYMENT`}
                alt='VietQR Payment'
                className='max-h-full max-w-full object-contain rounded-lg'
              />
            </div>

            <div className='space-y-1 mb-6'>
              <span className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block'>Amount to pay</span>
              <span className='text-xl font-black text-rose-500 block'>{formatPrice(totalCartValue)}</span>
              <span className='text-[10px] text-slate-400 font-bold block mt-1.5 bg-slate-100 py-1 px-3 rounded-full inline-block'>
                Message: PCSTORE PAYMENT
              </span>
            </div>

            <p className='text-[10px] text-slate-400 font-semibold leading-relaxed mb-6 bg-amber-50 text-amber-600 border border-amber-200/50 rounded-xl p-3.5'>
              ⚠️ After successfully scanning the code and transferring via your banking app, please click "I have transferred" to confirm your order.
            </p>

            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => setIsQrModalOpen(false)}
                className='flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={buyPurchaseMutation.isLoading}
                onClick={handleConfirmQrPayment}
                className='flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/10 cursor-pointer transition disabled:opacity-50'
              >
                {buyPurchaseMutation.isLoading ? 'Placing...' : 'I have transferred'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
