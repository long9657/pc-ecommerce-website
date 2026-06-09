import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPurchases, buyPurchases, deletePurchases, updatePurchase } from '../../api/purchase.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

export default function Bills() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    recipient_name: '',
    phone_number: '',
    shipping_address: ''
  })

  // Pre-fill from profile
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

  const { data: cartData } = useQuery({
    queryKey: ['purchases', 0],
    queryFn: () => getPurchases({ status: 0 })
  })

  const cartItems = cartData?.data?.result || []

  const updatePurchaseMutation = useMutation({
    mutationFn: (data: { id: string, buy_count: number }) => updatePurchase(data.id, { buy_count: data.buy_count }),
    onSuccess: () => queryClient.invalidateQueries(['purchases', 0])
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: (ids: string[]) => deletePurchases({ purchase_ids: ids }),
    onSuccess: () => queryClient.invalidateQueries(['purchases', 0])
  })

  const buyPurchaseMutation = useMutation({
    mutationFn: (data: { purchase_ids: string[], recipient_name: string, phone_number: string, shipping_address: string }) => buyPurchases(data),
    onSuccess: () => {
      toast.success('Đặt hàng thành công!')
      queryClient.invalidateQueries(['purchases', 0])
      queryClient.invalidateQueries(['purchases', -1])
      setIsCheckoutModalOpen(false)
      navigate('/profile/orders')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng')
    }
  })

  const totalCartValue = cartItems.reduce((acc: number, item: any) => acc + (item.product?.price || 0) * item.buy_count, 0)

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cartItems.length === 0) return
    buyPurchaseMutation.mutate({
      purchase_ids: cartItems.map((i: any) => i._id),
      recipient_name: checkoutForm.recipient_name,
      phone_number: checkoutForm.phone_number,
      shipping_address: checkoutForm.shipping_address
    })
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 font-sans'>
      <div className='mb-6 border-b border-gray-200 pb-4'>
        <h2 className='text-2xl font-bold text-gray-800'>Giỏ hàng của bạn</h2>
        <p className='text-sm text-gray-500 mt-1'>Có {cartItems.length} sản phẩm trong giỏ</p>
      </div>

      <div className='space-y-4'>
        {cartItems.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100'>
            <div className='text-gray-400 mb-4'>
              <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'></path>
              </svg>
            </div>
            <p className='text-gray-500 font-medium'>Giỏ hàng của bạn đang trống.</p>
            <button 
              onClick={() => navigate('/products')}
              className='mt-4 px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition'
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            {cartItems.map((item: any) => (
              <div key={item._id} className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center'>
                <img src={item.product?.image} alt={item.product?.name} className='w-24 h-24 object-contain rounded-lg bg-gray-50' />
                <div className='flex-1'>
                  <h4 className='font-semibold text-gray-800 line-clamp-2 leading-tight'>{item.product?.name}</h4>
                  <span className='font-bold text-rose-600 mt-2 block text-lg'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product?.price || 0)}
                  </span>
                </div>
                <div className='flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-white'>
                  <button 
                    onClick={() => updatePurchaseMutation.mutate({ id: item._id, buy_count: Math.max(1, item.buy_count - 1) })}
                    className='w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-center font-bold text-gray-600 transition'
                  >
                    -
                  </button>
                  <span className='w-8 text-center text-sm font-semibold'>{item.buy_count}</span>
                  <button 
                    onClick={() => updatePurchaseMutation.mutate({ id: item._id, buy_count: item.buy_count + 1 })}
                    className='w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-center font-bold text-gray-600 transition'
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => deletePurchaseMutation.mutate([item._id])}
                  className='text-red-500 hover:text-red-700 font-semibold text-sm ml-4 p-2 rounded-lg hover:bg-red-50 transition'
                >
                  Xóa
                </button>
              </div>
            ))}
            <div className='bg-white p-6 rounded-xl border border-blue-100 shadow-sm mt-6 flex flex-col md:flex-row justify-between items-center gap-4'>
              <div>
                <span className='text-gray-500 block text-sm font-medium'>Tổng tiền thanh toán ({cartItems.length} sản phẩm):</span>
                <span className='text-3xl font-black text-rose-600'>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCartValue)}
                </span>
              </div>
              <button 
                onClick={() => setIsCheckoutModalOpen(true)}
                className='w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl shadow-md transition'
              >
                THANH TOÁN
              </button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Thông tin nhận hàng</h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="text-white hover:text-blue-200">
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
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4 flex justify-between items-center">
                <span className="font-medium text-gray-600">Tổng thanh toán:</span>
                <span className="font-bold text-rose-600 text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCartValue)}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={buyPurchaseMutation.isLoading}
                  className="flex-1 py-2.5 px-4 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 shadow-md shadow-rose-200 transition disabled:opacity-70"
                >
                  {buyPurchaseMutation.isLoading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
