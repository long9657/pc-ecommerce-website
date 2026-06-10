import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import http from '../../../utils/http'
import { toast } from 'react-toastify'

const STATUS_LABELS: Record<number, { label: string; bg: string; text: string; dot: string }> = {
  1: { label: 'Pending', bg: 'bg-transparent', text: 'text-dark', dot: 'bg-amber-500' },
  2: { label: 'Processing', bg: 'bg-transparent', text: 'text-dark', dot: 'bg-blue-500' },
  3: { label: 'Shipping', bg: 'bg-transparent', text: 'text-dark', dot: 'bg-indigo-500' },
  4: { label: 'Delivered', bg: 'bg-transparent', text: 'text-dark', dot: 'bg-emerald-500' },
  5: { label: 'Cancelled', bg: 'bg-transparent', text: 'text-dark', dot: 'bg-gray-500' }
}

const STATUS_ACTIONS: Record<number, { next: number; label: string; style: string }[]> = {
  1: [
    { next: 2, label: 'Confirm', style: 'bg-primary text-white hover:bg-primary/90 rounded-md shadow-sm' },
    { next: 5, label: 'Cancel Order', style: 'bg-white border border-gray-300 text-dark hover:bg-gray-50 rounded-md shadow-sm' }
  ],
  2: [
    { next: 3, label: 'Ship', style: 'bg-primary text-white hover:bg-primary/90 rounded-md shadow-sm' },
    { next: 5, label: 'Cancel Order', style: 'bg-white border border-gray-300 text-dark hover:bg-gray-50 rounded-md shadow-sm' }
  ],
  3: [
    { next: 4, label: 'Mark Delivered', style: 'bg-primary text-white hover:bg-primary/90 rounded-md shadow-sm' }
  ],
  4: [],
  5: []
}

export default function OrdersAdmin() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => http.get('/orders/admin').then((r) => r.data.result)
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) =>
      http.patch(`/orders/update-status/${id}`, { status }),
    onSuccess: () => {
      toast.success('Updated status successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
    onError: () => toast.error('An error occurred!')
  })

  const formatPrice = (price: number) =>
    price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-US')

  const grouped: Record<number, any[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] }
  if (data) {
    data.forEach((p: any) => {
      if (grouped[p.status]) grouped[p.status].push(p)
    })
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    )

  if (error)
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-dark gap-4'>
        <p className='text-xl font-semibold'>⛔ Could not load orders data!</p>
      </div>
    )

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-xl font-semibold text-dark'>Orders Management</h1>
      </div>

      {/* Stats Summary */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {Object.entries(STATUS_LABELS).map(([status, info]) => {
          const count = grouped[Number(status)]?.length || 0
          return (
            <div key={status} className='bg-white p-5 border border-gray-200 rounded-md shadow-sm'>
              <div className='flex items-center gap-2 mb-2'>
                <div className={`w-2 h-2 rounded-full ${info.dot}`} />
                <span className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>{info.label}</span>
              </div>
              <div className='text-2xl font-bold text-dark'>{count}</div>
            </div>
          )
        })}
      </div>

      {/* Orders List */}
      <div className='space-y-8'>
        {[1, 2, 3, 4].map((status) => {
          const orders = grouped[status]
          if (orders.length === 0) return null
          const info = STATUS_LABELS[status]

          return (
            <div key={status} className='bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden'>
              {/* Header Section */}
              <div className={`px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50`}>
                <div className={`w-2 h-2 rounded-full ${info.dot}`} />
                <h2 className={`font-semibold text-sm uppercase tracking-wider ${info.text}`}>{info.label}</h2>
                <span className='bg-white text-dark border border-gray-200 px-2 py-0.5 text-xs font-semibold'>
                  {orders.length}
                </span>
              </div>

              {/* Items Section */}
              <div className='divide-y divide-gray-200'>
                {orders.map((order: any) => (
                  <div key={order._id} className='p-6 flex flex-col xl:flex-row gap-6 hover:bg-gray-50/50 transition-colors'>
                    
                    {/* Order Meta */}
                    <div className='flex-1 min-w-0 flex flex-col lg:flex-row gap-6'>
                      {/* Customer Info */}
                      <div className='w-full lg:w-1/3 space-y-3'>
                        <div className='flex items-center gap-2'>
                          <span className='bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 uppercase tracking-wider border border-gray-200'>
                            #{order._id.substring(0, 8)}
                          </span>
                          <span className='text-xs text-gray-400 font-medium'>
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                        <div>
                          <div className='font-semibold text-dark mb-1'>{order.recipient_name}</div>
                          <div className='text-sm text-gray-500 flex items-center gap-1.5 mb-1'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                            </svg>
                            {order.phone_number}
                          </div>
                          <div className='text-sm text-gray-500 flex items-start gap-1.5'>
                            <svg className='w-4 h-4 shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            <span className='leading-snug'>{order.shipping_address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Products List */}
                      <div className='w-full lg:w-2/3 flex flex-col gap-3'>
                        {order.purchases?.map((p: any, idx: number) => (
                          <div key={idx} className='flex items-center gap-4 bg-white border border-gray-200 p-3 rounded-md shadow-sm'>
                            <img
                              src={p.product?.image}
                              alt={p.product?.name}
                              className='w-14 h-14 object-contain bg-white border border-gray-200 p-1 shrink-0'
                            />
                            <div className='flex-1 min-w-0'>
                              <div className='text-sm font-medium text-dark truncate mb-1'>{p.product?.name}</div>
                              <div className='text-xs text-gray-500 font-medium'>
                                Qty: <span className='text-dark font-semibold'>x{p.buy_count}</span>
                                {p.variant && <span className='ml-2 text-gray-400'>| {p.variant}</span>}
                              </div>
                            </div>
                            <div className='text-right shrink-0 ml-2'>
                              <div className='text-sm font-semibold text-dark'>{formatPrice(p.price)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total & Actions */}
                    <div className='shrink-0 flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-4 border-t xl:border-t-0 xl:border-l border-gray-200 pt-4 xl:pt-0 xl:pl-6 min-w-[200px]'>
                      <div className='text-left xl:text-right'>
                        <div className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1'>Total Amount</div>
                        <div className='text-lg font-bold text-red-600'>{formatPrice(order.final_price)}</div>
                      </div>
                      
                      <div className='flex gap-2 flex-wrap justify-end'>
                        {STATUS_ACTIONS[status]?.map((action) => (
                          <button
                            key={action.next}
                            onClick={() => updateStatusMutation.mutate({ id: order._id, status: action.next })}
                            disabled={updateStatusMutation.isLoading}
                            className={`px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${action.style}`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {data?.length === 0 && (
          <div className='bg-white border border-gray-200 p-16 text-center rounded-md shadow-sm'>
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
            <h3 className='text-lg font-semibold text-dark mb-1'>No Orders Yet</h3>
            <p className='text-gray-500 text-sm'>There are no orders in the system currently.</p>
          </div>
        )}
      </div>
    </div>
  )
}
