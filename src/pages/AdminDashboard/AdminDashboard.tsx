import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import http from '../../utils/http'
import { toast } from 'react-toastify'
import { Link } from 'react-router'

const STATUS_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Chờ xác nhận', color: '#f59e0b' },
  2: { label: 'Đang xử lý', color: '#3b82f6' },
  3: { label: 'Đã giao', color: '#10b981' },
  4: { label: 'Đã hủy', color: '#ef4444' }
}

const STATUS_ACTIONS: Record<number, { next: number; label: string }[]> = {
  1: [
    { next: 2, label: '✅ Xác nhận' },
    { next: 4, label: '❌ Hủy đơn' }
  ],
  2: [
    { next: 3, label: '🚚 Đã giao' },
    { next: 4, label: '❌ Hủy đơn' }
  ],
  3: [],
  4: []
}

export default function AdminDashboard() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-purchases'],
    queryFn: () => http.get('/purchases/admin/all').then((r) => r.data.result)
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) =>
      http.patch(`/purchases/admin/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-purchases'] })
    },
    onError: () => toast.error('Có lỗi xảy ra!')
  })

  const formatPrice = (price: number) =>
    price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('vi-VN')

  const grouped: Record<number, any[]> = { 1: [], 2: [], 3: [], 4: [] }
  if (data) {
    data.forEach((p: any) => {
      if (grouped[p.status]) grouped[p.status].push(p)
    })
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-950'>
        <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )

  if (error)
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-4'>
        <p className='text-xl'>⛔ Bạn không có quyền Admin hoặc chưa đăng nhập!</p>
        <Link to='/login' className='bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition'>
          Đăng nhập
        </Link>
      </div>
    )

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 32 }}>🛡️</span>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Admin Dashboard</h1>
            <p style={{ margin: 0, opacity: 0.75, fontSize: 14 }}>PCStore — Quản lý đơn hàng</p>
          </div>
        </div>
        <Link
          to='/'
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            backdropFilter: 'blur(4px)'
          }}
        >
          ← Về trang chủ
        </Link>
      </div>

      {/* Stats */}
      <div style={{ padding: '24px 40px 0', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_LABELS).map(([status, info]) => (
          <div
            key={status}
            style={{
              background: '#1e293b',
              border: `1px solid ${info.color}44`,
              borderRadius: 12,
              padding: '16px 28px',
              flex: '1 1 160px',
              boxShadow: `0 0 16px ${info.color}22`
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: info.color }}>
              {grouped[Number(status)]?.length || 0}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{info.label}</div>
          </div>
        ))}
      </div>

      {/* Order sections by status */}
      <div style={{ padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {[1, 2, 3, 4].map((status) => {
          const orders = grouped[status]
          if (orders.length === 0) return null
          const info = STATUS_LABELS[status]
          return (
            <div key={status}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: info.color
                  }}
                />
                {info.label}
                <span
                  style={{
                    background: info.color + '33',
                    color: info.color,
                    fontSize: 12,
                    padding: '2px 10px',
                    borderRadius: 99,
                    fontWeight: 700
                  }}
                >
                  {orders.length}
                </span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.map((order: any) => (
                  <div
                    key={order._id}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: 12,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'border-color 0.2s'
                    }}
                  >
                    {/* Product Image */}
                    <img
                      src={order.product?.image}
                      alt={order.product?.name}
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: 'contain',
                        borderRadius: 8,
                        background: '#0f172a',
                        flexShrink: 0
                      }}
                    />
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {order.product?.name}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                        👤 {order.user?.name || order.user?.email} &nbsp;|&nbsp; SL: {order.buy_count} &nbsp;|&nbsp;{' '}
                        🕐 {formatDate(order.updated_at)}
                      </div>
                    </div>
                    {/* Price */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 15 }}>
                        {formatPrice(order.product?.price * order.buy_count)}
                      </div>
                      <div style={{ color: '#64748b', fontSize: 12, textDecoration: 'line-through' }}>
                        {formatPrice(order.product?.price_before_discount * order.buy_count)}
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {STATUS_ACTIONS[status]?.map((action) => (
                        <button
                          key={action.next}
                          onClick={() =>
                            updateStatusMutation.mutate({ id: order._id, status: action.next })
                          }
                          disabled={updateStatusMutation.isLoading}
                          style={{
                            padding: '7px 14px',
                            borderRadius: 8,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            background: action.next === 4 ? '#7f1d1d' : '#1e3a8a',
                            color: '#fff',
                            opacity: updateStatusMutation.isLoading ? 0.6 : 1,
                            transition: 'opacity 0.2s'
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {data?.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              color: '#475569',
              fontSize: 18
            }}
          >
            📭 Chưa có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  )
}
