import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../../../api/stats.api'

export default function Dashboard() {
  const { data: statsResponse } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getDashboardStats
  })

  const statsData = statsResponse?.data?.data || {
    todayRevenue: 0,
    newOrdersCount: 0,
    outOfStockCount: 0,
    newCustomersCount: 0
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className='text-xl font-semibold text-dark mb-6'>Dashboard Overview</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Metric Cards */}
        {[
          { label: "Today's Revenue", value: formatPrice(statsData.todayRevenue) },
          { label: 'New Orders', value: statsData.newOrdersCount.toString() },
          { label: 'Out of Stock', value: statsData.outOfStockCount.toString() },
          { label: 'New Customers', value: statsData.newCustomersCount.toString() }
        ].map((stat, idx) => (
          <div key={idx} className='bg-white p-6 border border-gray-200 rounded-md shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <div className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>{stat.label}</div>
            </div>
            <div className='text-2xl font-bold text-dark'>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className='bg-white p-8 border border-gray-200 rounded-md shadow-sm min-h-[400px] flex items-center justify-center flex-col text-center'>
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className='text-xl font-semibold text-dark mb-2'>Revenue Statistics</h2>
        <p className='text-gray-500 text-sm'>Statistical data will be displayed here in the future.</p>
      </div>
    </div>
  )
}
