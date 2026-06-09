import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, cancelOrder } from '../../api/purchase.api'
import { toast } from 'react-toastify'

const tabs = [
  { id: 'all', name: 'Tất cả', status: -1 },
  { id: 'wait', name: 'Chờ xác nhận', status: 1 },
  { id: 'progress', name: 'Đang xử lý', status: 2 },
  { id: 'delivered', name: 'Đã giao', status: 3 },
  { id: 'cancelled', name: 'Đã hủy', status: 4 }
]

export default function Orders() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState(tabs[0])

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', activeTab.status],
    queryFn: () => getOrders({ status: activeTab.status })
  })

  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: () => {
      toast.success('Đã hủy đơn hàng thành công')
      queryClient.invalidateQueries(['orders', activeTab.status])
      queryClient.invalidateQueries(['orders', -1])
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng này')
    }
  })

  const orders = ordersData?.data?.result || []

  // Nhóm các purchase lại thành đơn hàng? Backend hiện tại coi mỗi purchase là 1 đơn.
  // Giao diện hiển thị:
  
  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return { text: 'CHỜ XÁC NHẬN', color: 'text-orange-500' }
      case 2: return { text: 'ĐANG XỬ LÝ', color: 'text-blue-500' }
      case 3: return { text: 'ĐÃ GIAO HÀNG', color: 'text-green-500' }
      case 4: return { text: 'ĐÃ HỦY', color: 'text-red-500' }
      default: return { text: 'KHÔNG XÁC ĐỊNH', color: 'text-gray-500' }
    }
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 font-sans min-h-[70vh]'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white'>
          <h2 className='text-2xl font-bold'>Đơn hàng của tôi</h2>
          <p className='text-blue-100 text-sm mt-1'>Quản lý và theo dõi trạng thái đơn hàng của bạn</p>
        </div>

        {/* Tabs */}
        <div className='flex overflow-x-auto border-b border-gray-200 bg-white sticky top-0 z-10'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab.id === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className='p-6 bg-gray-50/50 space-y-4'>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-xl border border-gray-100'>
              <svg className='w-16 h-16 mx-auto text-gray-300 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'></path>
              </svg>
              <p className='text-gray-500 font-medium text-lg'>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            orders.map((order: any) => {
              const statusInfo = getStatusText(order.status)
              
              return (
                <div key={order._id} className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                  {/* Header đơn hàng */}
                  <div className='flex justify-between items-center px-6 py-3 border-b border-gray-100 bg-gray-50'>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-gray-700 text-sm'>
                        Mã đơn: <span className='text-blue-600'>#{order._id.substring(0, 8).toUpperCase()}</span>
                      </span>
                      <span className='text-gray-300'>|</span>
                      <span className='text-gray-500 text-sm'>{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className={`font-bold text-sm flex items-center gap-1.5 ${statusInfo.color}`}>
                      {statusInfo.text}
                    </div>
                  </div>

                  {/* Danh sách sản phẩm trong đơn hàng */}
                  <div className='flex flex-col border-b border-gray-100'>
                    {order.purchases?.map((item: any) => (
                      <div key={item._id} className='p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b last:border-0 border-gray-100'>
                        <img src={item.product?.image} className='w-24 h-24 object-contain rounded-lg bg-gray-50 border border-gray-100' alt={item.product?.name} />
                        <div className='flex-1 text-center sm:text-left w-full'>
                          <h4 className='font-bold text-gray-800 text-lg line-clamp-2'>{item.product?.name}</h4>
                          <div className='mt-2 text-gray-500 text-sm flex flex-col sm:flex-row gap-2 sm:gap-6'>
                            {item.variant && <span>Phân loại: <span className='text-gray-700 font-medium'>{item.variant}</span></span>}
                            <span>Số lượng: <span className='text-gray-700 font-medium'>x{item.buy_count}</span></span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <span className='text-gray-500 line-through text-sm mr-2'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * 1.2)}
                          </span>
                          <span className='font-bold text-rose-600 text-lg whitespace-nowrap block mt-1'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer đơn hàng */}
                  <div className='px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4'>
                    <div className='text-gray-500 text-sm'>
                      Đang giao đến: <span className='font-semibold text-gray-700'>{order.recipient_name || 'Khách hàng'}</span>
                    </div>
                    <div className='flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end'>
                      <div className='text-right'>
                        <span className='text-gray-600 text-sm mr-2'>Tổng cộng:</span>
                        <span className='text-xl font-black text-rose-600'>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.final_price)}
                        </span>
                      </div>
                      
                      {(order.status === 1 || order.status === 2) && (
                        <button 
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                              cancelOrderMutation.mutate(order._id)
                            }
                          }}
                          disabled={cancelOrderMutation.isLoading}
                          className='px-6 py-2 border border-gray-300 text-gray-700 bg-white font-semibold rounded-lg hover:bg-gray-50 transition shadow-sm'
                        >
                          Hủy đơn
                        </button>
                      )}
                      {(order.status === 3 || order.status === 4) && (
                        <button 
                          className='px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-200'
                        >
                          Mua lại
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
