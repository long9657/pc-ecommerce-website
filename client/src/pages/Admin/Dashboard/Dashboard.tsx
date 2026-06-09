export default function Dashboard() {
  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className='text-2xl font-bold text-slate-800 mb-6'>Tổng quan (Dashboard)</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Placeholder Stat Cards */}
        {[
          { label: 'Doanh thu hôm nay', value: '0 đ', color: 'bg-blue-500' },
          { label: 'Đơn hàng mới', value: '0', color: 'bg-emerald-500' },
          { label: 'Sản phẩm hết hàng', value: '0', color: 'bg-rose-500' },
          { label: 'Khách hàng mới', value: '0', color: 'bg-amber-500' }
        ].map((stat, idx) => (
          <div key={idx} className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${stat.color}`}>
                +
              </div>
              <div>
                <div className='text-sm font-semibold text-slate-500'>{stat.label}</div>
                <div className='text-2xl font-black text-slate-800'>{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center flex-col'>
        <div className='text-6xl mb-4'>📈</div>
        <h2 className='text-xl font-bold text-slate-700 mb-2'>Khu vực biểu đồ</h2>
        <p className='text-slate-500 font-medium'>Dữ liệu thống kê sẽ được hiển thị tại đây trong tương lai.</p>
      </div>
    </div>
  )
}
