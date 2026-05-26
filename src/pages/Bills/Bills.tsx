import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPurchases, buyPurchases, deletePurchases, updatePurchase } from '../../api/purchase.api'
import { toast } from 'react-toastify'

export default function Bills() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart')

  const { data: cartData } = useQuery({
    queryKey: ['purchases', 0],
    queryFn: () => getPurchases({ status: 0 })
  })

  const { data: historyData } = useQuery({
    queryKey: ['purchases', 1],
    queryFn: () => getPurchases({ status: 1 })
  })

  const cartItems = cartData?.data?.result || []
  const historyItems = historyData?.data?.result || []

  const updatePurchaseMutation = useMutation({
    mutationFn: (data: { id: string, buy_count: number }) => updatePurchase(data.id, { buy_count: data.buy_count }),
    onSuccess: () => queryClient.invalidateQueries(['purchases', 0])
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: (ids: string[]) => deletePurchases({ purchase_ids: ids }),
    onSuccess: () => queryClient.invalidateQueries(['purchases', 0])
  })

  const buyPurchaseMutation = useMutation({
    mutationFn: (ids: string[]) => buyPurchases({ purchase_ids: ids }),
    onSuccess: () => {
      toast.success('Đặt hàng thành công!')
      queryClient.invalidateQueries(['purchases', 0])
      queryClient.invalidateQueries(['purchases', 1])
      setActiveTab('history')
    }
  })

  const totalCartValue = cartItems.reduce((acc: number, item: any) => acc + (item.product?.price || 0) * item.buy_count, 0)
  const totalHistoryValue = historyItems.reduce((acc: number, item: any) => acc + (item.product?.price || 0) * item.buy_count, 0)

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 font-sans'>
      <div className='mb-6 flex gap-4 border-b border-gray-200 pb-2'>
        <button 
          onClick={() => setActiveTab('cart')}
          className={`text-lg font-bold pb-2 ${activeTab === 'cart' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
        >
          Giỏ hàng ({cartItems.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`text-lg font-bold pb-2 ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
        >
          Đơn hàng chờ xử lý ({historyItems.length})
        </button>
      </div>

      {activeTab === 'cart' && (
        <div className='space-y-4'>
          {cartItems.length === 0 ? (
            <div className='text-center py-10 text-gray-500'>Giỏ hàng của bạn đang trống.</div>
          ) : (
            <>
              {cartItems.map((item: any) => (
                <div key={item._id} className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center'>
                  <img src={item.product?.image} alt={item.product?.name} className='w-20 h-20 object-contain rounded-lg bg-gray-50' />
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-800 line-clamp-2'>{item.product?.name}</h4>
                    <span className='font-bold text-rose-600 mt-2 block'>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product?.price || 0)}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 border border-gray-200 rounded-lg p-1'>
                    <button 
                      onClick={() => updatePurchaseMutation.mutate({ id: item._id, buy_count: Math.max(1, item.buy_count - 1) })}
                      className='w-6 h-6 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-600'
                    >
                      -
                    </button>
                    <span className='w-8 text-center text-sm font-semibold'>{item.buy_count}</span>
                    <button 
                      onClick={() => updatePurchaseMutation.mutate({ id: item._id, buy_count: item.buy_count + 1 })}
                      className='w-6 h-6 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-600'
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => deletePurchaseMutation.mutate([item._id])}
                    className='text-red-500 font-semibold text-xs ml-4'
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <div className='bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6 flex justify-between items-center'>
                <div>
                  <span className='text-gray-500 block text-sm font-semibold'>Tổng tiền thanh toán:</span>
                  <span className='text-2xl font-black text-rose-600'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCartValue)}
                  </span>
                </div>
                <button 
                  onClick={() => buyPurchaseMutation.mutate(cartItems.map((i: any) => i._id))}
                  className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition'
                >
                  THANH TOÁN NGAY
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className='space-y-4'>
          {historyItems.length === 0 ? (
            <div className='text-center py-10 text-gray-500'>Bạn chưa có đơn hàng nào đang chờ.</div>
          ) : (
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='bg-blue-50 px-6 py-4 border-b border-blue-100'>
                <h3 className='font-bold text-blue-700'>Trạng thái: Đang chờ Chủ Shop xác nhận</h3>
              </div>
              <div className='px-6 py-4 divide-y divide-gray-100'>
                {historyItems.map((item: any) => (
                  <div key={item._id} className='py-4 flex justify-between items-center gap-4'>
                    <img src={item.product?.image} className='w-16 h-16 object-contain rounded-lg bg-gray-50' />
                    <div className='flex-1'>
                      <h4 className='font-semibold text-gray-800 line-clamp-1'>{item.product?.name}</h4>
                      <p className='text-sm text-gray-500 mt-1'>Số lượng: {item.buy_count}</p>
                    </div>
                    <span className='font-bold text-gray-700'>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((item.product?.price || 0) * item.buy_count)}
                    </span>
                  </div>
                ))}
              </div>
              <div className='bg-gray-50 px-6 py-4 flex justify-between items-center'>
                <span className='font-medium text-gray-500'>Tổng tiền đã đặt:</span>
                <span className='text-xl font-black text-rose-600'>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalHistoryValue)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
