import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, cancelOrder, addToCart } from '../../api/purchase.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

const tabs = [
  { id: 'all', name: 'All Orders', status: -1 },
  { id: 'wait', name: 'Pending', status: 1 },
  { id: 'progress', name: 'Processing', status: 2 },
  { id: 'shipping', name: 'Shipping', status: 3 },
  { id: 'delivered', name: 'Delivered', status: 4 },
  { id: 'cancelled', name: 'Cancelled', status: 5 }
]

const STATUS_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Pending', color: 'border-orange-200 text-orange-600', bg: 'bg-orange-500' },
  2: { label: 'Processing', color: 'border-blue-200 text-blue-600', bg: 'bg-blue-500' },
  3: { label: 'Shipping', color: 'border-indigo-200 text-indigo-600', bg: 'bg-indigo-500' },
  4: { label: 'Delivered', color: 'border-emerald-200 text-emerald-600', bg: 'bg-emerald-500' },
  5: { label: 'Cancelled', color: 'border-gray-200 text-gray-500', bg: 'bg-gray-400' }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function Orders() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(tabs[0])

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', activeTab.status],
    queryFn: () => getOrders({ status: activeTab.status })
  })

  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: () => {
      toast.success('Order cancelled successfully')
      queryClient.invalidateQueries(['orders', activeTab.status])
      queryClient.invalidateQueries(['orders', -1])
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cannot cancel this order')
    }
  })

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => addToCart(body)
  })

  const handleBuyAgain = async (purchases: any[]) => {
    try {
      // Gọi api thêm vào giỏ hàng cho từng sản phẩm trong đơn hàng
      const promises = purchases.map(purchase => 
        addToCartMutation.mutateAsync({ product_id: purchase.product_id, buy_count: purchase.buy_count })
      )
      await Promise.all(promises)
      toast.success('Added products to cart')
      queryClient.invalidateQueries(['purchases', 0]) // Invalidate cart
      navigate('/bills') // Chuyển đến trang giỏ hàng
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error adding to cart')
    }
  }

  const orders = ordersData?.data?.result || []

  return (
    <div className='bg-transparent font-sans'>
      <h2 className='text-xl font-bold text-dark mb-6'>My Orders</h2>

      {/* Tabs */}
      <div className='flex gap-8 overflow-x-auto border-b border-gray-200 mb-6 select-none max-w-full scrollbar-none'>
        {tabs.map((tab) => {
          const isSelected = activeTab.id === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 text-sm font-semibold transition cursor-pointer flex-shrink-0 border-b-2 ${
                isSelected
                  ? 'border-primary text-dark'
                  : 'border-transparent text-gray-400 hover:text-dark'
              }`}
            >
              {tab.name}
            </button>
          )
        })}
      </div>

      <div className='space-y-0'>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className='text-center py-20 select-none'>
            <div className='mx-auto w-24 h-24 mb-6 opacity-80'>
              <svg viewBox="0 0 117 117" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="58.5" cy="58.5" r="58.5" fill="#F5F7FF"/>
                <path d="M42 45H75M42 58H60M35 30H82C85.866 30 89 33.134 89 37V87C89 90.866 85.866 94 82 94H35C31.134 94 28 90.866 28 87V37C28 33.134 31.134 30 35 30Z" stroke="#0156FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className='text-gray-500 font-medium text-sm'>You have placed no orders.</p>
          </div>
        ) : (
          orders.map((order: any) => {
            const info = STATUS_LABELS[order.status]
            
            return (
              <div key={order._id} className='border-b border-gray-200 py-6 last:border-0'>
                {/* Header đơn hàng */}
                <div className='flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-4 gap-4'>
                  <div className='flex items-center gap-3'>
                    <span className='font-semibold text-dark text-sm'>
                      Order ID: #{order._id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className='w-1 h-1 rounded-full bg-gray-300'></span>
                    <span className='text-gray-500 text-xs'>{formatDate(order.created_at)}</span>
                  </div>
                  {info && (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border ${info.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${info.bg}`} />
                      {info.label}
                    </span>
                  )}
                </div>

                {/* Danh sách sản phẩm trong đơn hàng */}
                <div className='flex flex-col'>
                  {order.purchases?.map((item: any) => (
                    <div key={item._id} className='p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b last:border-0 border-gray-100'>
                      <div className='w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-2 flex-shrink-0'>
                        <img src={item.product?.image} className='w-full h-full object-contain' alt={item.product?.name} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-semibold text-dark text-sm leading-snug line-clamp-2 mb-1.5'>{item.product?.name}</h4>
                        <div className='text-xs text-gray-500 flex flex-col sm:flex-row gap-2 sm:gap-6'>
                          {item.variant && <span>Variant: <span className='text-dark font-medium'>{item.variant}</span></span>}
                          <span>Qty: <span className='text-dark font-medium'>x{item.buy_count}</span></span>
                        </div>
                      </div>
                      <div className='text-right min-w-[120px]'>
                        <span className='text-xs text-gray-500 block mb-1'>Unit Price</span>
                        <span className='text-sm font-semibold text-dark block'>
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='pt-4 flex flex-col sm:flex-row justify-between items-center gap-4'>
                  <div className='text-gray-500 text-xs'>
                    Delivering to: <span className='font-semibold text-dark'>{order.recipient_name || 'Customer'}</span>
                  </div>
                  <div className='flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto'>
                    <div className='text-right flex items-center gap-3'>
                      <span className='text-xs text-gray-500'>Total amount:</span>
                      <span className='text-base font-bold text-dark'>
                        {formatPrice(order.final_price)}
                      </span>
                    </div>
                    
                    <div className='flex gap-3'>
                      {(order.status === 1 || order.status === 2) && (
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this order?')) {
                              cancelOrderMutation.mutate(order._id)
                            }
                          }}
                          disabled={cancelOrderMutation.isLoading}
                          className='text-red-500 hover:underline text-xs font-semibold transition cursor-pointer disabled:opacity-50'
                        >
                          Cancel order
                        </button>
                      )}
                      {(order.status === 4 || order.status === 5) && (
                        <button 
                          onClick={() => handleBuyAgain(order.purchases || [])}
                          disabled={addToCartMutation.isLoading}
                          className='text-primary hover:underline text-xs font-semibold transition cursor-pointer disabled:opacity-50'
                        >
                          {addToCartMutation.isLoading ? 'Adding...' : 'Buy again'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
