import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPurchases, buyPurchases } from '../../api/purchase.api'
import { toast } from 'react-toastify'

export default function Checkout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [checkoutForm, setCheckoutForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    shippingMethod: 'standard'
  })

  useEffect(() => {
    const profileStr = localStorage.getItem('profile')
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr)
        setCheckoutForm(prev => ({
          ...prev,
          email: profile.email || '',
          firstName: profile.name || '',
          phone: profile.phone || '',
          streetAddress: profile.address || ''
        }))
      } catch (e) {}
    }
  }, [])

  const { data: cartData } = useQuery({
    queryKey: ['purchases', 0],
    queryFn: () => getPurchases({ status: 0 })
  })
  const cartItems = cartData?.data?.result || []

  const totalCartValue = useMemo(() => {
    return cartItems.reduce((acc: number, item: any) => acc + (item.product?.price || 0) * item.buy_count, 0)
  }, [cartItems])

  const buyPurchaseMutation = useMutation({
    mutationFn: (data: { purchase_ids: string[], recipient_name: string, phone_number: string, shipping_address: string }) => buyPurchases(data),
    onSuccess: () => {
      toast.success('Đặt hàng thành công!')
      queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
      queryClient.invalidateQueries({ queryKey: ['purchases', 1] })
      navigate('/bills')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại!')
    }
  })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống!')
      return
    }
    
    setIsQrModalOpen(true)
  }

  const handleConfirmQrPayment = () => {
    buyPurchaseMutation.mutate({
      purchase_ids: cartItems.map((i: any) => i._id),
      recipient_name: `${checkoutForm.firstName} ${checkoutForm.lastName}`,
      phone_number: checkoutForm.phone,
      shipping_address: `${checkoutForm.streetAddress}, ${checkoutForm.city}, ${checkoutForm.state}, ${checkoutForm.country}`
    })
  }

  return (
    <div className='min-h-screen bg-white font-sans px-4 py-8 mb-12'>
      <div className='max-w-7xl mx-auto'>
        {/* Navigation Breadcrumb */}
        <nav className='flex items-center gap-1.5 text-xs text-dark opacity-70 mb-8'>
          <Link to='/' className='hover:text-primary transition'>Home</Link>
          <span className='opacity-50'>›</span>
          <Link to='/bills' className='hover:text-primary transition'>Shopping Cart</Link>
          <span className='opacity-50'>›</span>
          <span className='font-medium text-dark'>Checkout Process</span>
        </nav>

        <div className='flex flex-col lg:flex-row justify-between items-start mb-8'>
          <h1 className='text-[32px] font-light text-dark'>Checkout</h1>
          
          <div className='flex items-center gap-4 text-xs font-semibold'>
            <div className='flex flex-col items-center gap-2'>
              <div className='w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'/></svg>
              </div>
              <span className='text-dark'>Shipping</span>
            </div>
            <div className='w-24 h-[2px] bg-gray-200 -mt-6'></div>
            <div className='flex flex-col items-center gap-2'>
              <div className='w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 font-bold'>
                2
              </div>
              <span className='text-gray-400'>Review & Payments</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Left Column: Shipping Form */}
          <div className='flex-1'>
            <div className='border-b border-gray-200 pb-4 mb-6'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl font-bold text-dark'>Shipping Address</h2>
                <Link to='/login' className='text-sm text-primary font-semibold hover:underline border border-primary px-6 py-2 rounded-full'>Sign In</Link>
              </div>
            </div>

            <form onSubmit={handleNext} className='max-w-2xl'>
              <div className='space-y-6 mb-12'>
                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>Email Address <span className='text-red-500'>*</span></label>
                  <input required type='email' value={checkoutForm.email} onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition' />
                  <p className='text-xs text-gray-400 mt-2'>You can create an account after checkout.</p>
                </div>
                
                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>First Name <span className='text-red-500'>*</span></label>
                  <input required type='text' value={checkoutForm.firstName} onChange={e => setCheckoutForm({...checkoutForm, firstName: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition' />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>Last Name <span className='text-red-500'>*</span></label>
                  <input required type='text' value={checkoutForm.lastName} onChange={e => setCheckoutForm({...checkoutForm, lastName: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition' />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>Company</label>
                  <input type='text' value={checkoutForm.company} onChange={e => setCheckoutForm({...checkoutForm, company: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition' />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>Street Address <span className='text-red-500'>*</span></label>
                  <input required type='text' value={checkoutForm.streetAddress} onChange={e => setCheckoutForm({...checkoutForm, streetAddress: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition mb-2' />
                  <input type='text' className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition mb-2' />
                  <input type='text' className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition' />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>City <span className='text-red-500'>*</span></label>
                  <input required type='text' value={checkoutForm.city} onChange={e => setCheckoutForm({...checkoutForm, city: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition' />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>State/Province <span className='text-red-500'>*</span></label>
                  <select required value={checkoutForm.state} onChange={e => setCheckoutForm({...checkoutForm, state: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition bg-white'>
                    <option value=''>Please, select a region, state or province</option>
                    <option value='HCM'>Ho Chi Minh</option>
                    <option value='HN'>Ha Noi</option>
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>Zip/Postal Code <span className='text-red-500'>*</span></label>
                  <input required type='text' value={checkoutForm.zipCode} onChange={e => setCheckoutForm({...checkoutForm, zipCode: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition' />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>Country <span className='text-red-500'>*</span></label>
                  <select required value={checkoutForm.country} onChange={e => setCheckoutForm({...checkoutForm, country: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition bg-white'>
                    <option value='United States'>United States</option>
                    <option value='Vietnam'>Vietnam</option>
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-dark mb-2'>Phone Number <span className='text-red-500'>*</span></label>
                  <input required type='tel' value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} className='w-full p-3 border border-gray-300 rounded focus:border-primary outline-none transition' />
                </div>
              </div>

              <div className='border-t border-gray-200 pt-8 mb-8'>
                <div className='flex justify-between items-center border-b border-gray-200 pb-4 mb-4'>
                  <label className='block text-xs font-bold text-dark'>Standard Rate</label>
                  <span className='font-bold text-dark'>$21.00</span>
                </div>
                <label className='flex items-center gap-3 cursor-pointer mb-6'>
                  <input type='radio' name='shipping' checked={checkoutForm.shippingMethod === 'standard'} onChange={() => setCheckoutForm({...checkoutForm, shippingMethod: 'standard'})} className='w-4 h-4 text-primary' />
                  <span className='text-sm text-dark'>Price may vary depending on the item/destination. Shop Staff will contact you.</span>
                </label>

                <div className='flex justify-between items-center border-b border-gray-200 pb-4 mb-4'>
                  <label className='block text-xs font-bold text-dark'>Pickup from store</label>
                  <span className='font-bold text-dark'>$0.00</span>
                </div>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='radio' name='shipping' checked={checkoutForm.shippingMethod === 'pickup'} onChange={() => setCheckoutForm({...checkoutForm, shippingMethod: 'pickup'})} className='w-4 h-4 text-primary' />
                  <span className='text-sm text-dark'>1234 Street Adress City Address, 1234</span>
                </label>
              </div>

              <button disabled={buyPurchaseMutation.isLoading} type='submit' className='px-12 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer'>
                {buyPurchaseMutation.isLoading ? 'Processing...' : 'Next'}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className='w-full lg:w-[380px] shrink-0 bg-slate-50 p-6'>
            <h2 className='text-xl font-bold text-dark mb-6'>Order Summary</h2>
            
            <div className='border-b border-gray-200 pb-4 mb-4 cursor-pointer flex justify-between items-center'>
              <span className='font-semibold text-sm text-dark'>{cartItems.length} Items in Cart</span>
              <svg className='w-4 h-4 text-gray-500 rotate-180' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
            </div>

            <div className='space-y-6'>
              {cartItems.map((item: any) => (
                <div key={item._id} className='flex gap-4'>
                  <img src={item.product?.image} alt={item.product?.name} className='w-16 h-16 object-contain shrink-0 bg-white border border-gray-100 p-1' />
                  <div>
                    <h4 className='text-xs font-semibold text-dark line-clamp-2 leading-relaxed mb-2'>{item.product?.name}</h4>
                    <div className='flex gap-2 items-center text-xs'>
                      <span className='text-gray-400'>Qty {item.buy_count}</span>
                      <span className='font-bold text-dark'>{formatPrice(item.product?.price * item.buy_count)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
