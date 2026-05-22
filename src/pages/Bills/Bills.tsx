import { useState } from 'react'

interface BillItem {
  id: string
  date: string
  products: { name: string; quantity: number; price: number }[]
  total: number
  status: 'Pending' | 'Shipping' | 'Completed' | 'Cancelled'
}

export default function Bills() {
  const [bills] = useState<BillItem[]>([
    {
      id: 'PCSTORE-10248',
      date: '2026-05-18',
      products: [
        { name: 'Bàn phím cơ Razer BlackWidow V4 Pro', quantity: 1, price: 5490000 },
        { name: 'Chuột Gaming ASUS ROG Harpe Ace Extreme', quantity: 1, price: 4290000 }
      ],
      total: 9780000,
      status: 'Shipping'
    },
    {
      id: 'PCSTORE-09941',
      date: '2026-04-12',
      products: [
        { name: 'Laptop Gaming MSI Raider GE78 HX', quantity: 1, price: 68990000 }
      ],
      total: 68990000,
      status: 'Completed'
    },
    {
      id: 'PCSTORE-08412',
      date: '2026-03-05',
      products: [
        { name: 'Card màn hình ASUS ROG Strix RTX 4090 OC', quantity: 1, price: 59990000 },
        { name: 'Nguồn ASUS ROG Thor 1200W Platinum II', quantity: 1, price: 8990000 }
      ],
      total: 68980000,
      status: 'Completed'
    }
  ])

  const getStatusBadge = (status: BillItem['status']) => {
    switch (status) {
      case 'Pending':
        return <span className='px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100'>Chờ xử lý</span>
      case 'Shipping':
        return <span className='px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100'>Đang giao hàng</span>
      case 'Completed':
        return <span className='px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-100'>Đã hoàn thành</span>
      case 'Cancelled':
        return <span className='px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-100'>Đã hủy</span>
    }
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 font-sans'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Lịch sử mua hàng</h2>
        <p className='text-sm text-gray-500 mt-1'>Theo dõi trạng thái và lịch sử tất cả các hóa đơn của bạn</p>
      </div>

      <div className='space-y-4'>
        {bills.map((bill) => (
          <div key={bill.id} className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-300 transition duration-300'>
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
              <div>
                <span className='text-xs text-gray-400 font-medium uppercase'>Mã hóa đơn</span>
                <h3 className='text-sm font-bold text-blue-600'>{bill.id}</h3>
              </div>
              <div className='flex items-center gap-4 text-sm'>
                <div>
                  <span className='text-xs text-gray-400 font-medium block text-right'>Ngày mua</span>
                  <span className='font-medium text-gray-700'>{bill.date}</span>
                </div>
                <div>
                  <span className='text-xs text-gray-400 font-medium block text-right'>Trạng thái</span>
                  {getStatusBadge(bill.status)}
                </div>
              </div>
            </div>

            <div className='px-6 py-4 divide-y divide-gray-100'>
              {bill.products.map((prod, idx) => (
                <div key={idx} className='py-3 flex justify-between items-center text-sm gap-4'>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-800 line-clamp-1'>{prod.name}</h4>
                    <p className='text-xs text-gray-400 mt-0.5'>Số lượng: {prod.quantity}</p>
                  </div>
                  <span className='font-bold text-gray-700'>
                    {prod.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>

            <div className='bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex justify-between items-center'>
              <span className='text-xs text-gray-500 font-medium'>Tổng giá trị đơn hàng:</span>
              <span className='text-lg font-extrabold text-red-600'>
                {bill.total.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
