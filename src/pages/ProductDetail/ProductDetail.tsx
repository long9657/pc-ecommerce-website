import { Link, useNavigate, useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductDetail } from '../../api/product.api'
import { addToCart } from '../../api/purchase.api'
import { toast } from 'react-toastify'
import { getIdFromNameId } from '../../utils/utils'

export default function ProductDetail() {
    const { id: nameId } = useParams()
    const navigate = useNavigate()
    const id = getIdFromNameId(nameId as string)

    const { data, isLoading } = useQuery({
      queryKey: ['product', id],
      queryFn: () => getProductDetail(id as string)
    })

    const queryClient = useQueryClient()
    const addToCartMutation = useMutation({
      mutationFn: () => addToCart({ product_id: id as string, buy_count: 1 }),
      onSuccess: () => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng!')
        queryClient.invalidateQueries({ queryKey: ['purchases', 0] })
      },
      onError: (error: any) => {
        if (error.response?.status === 422 || error.response?.status === 401) {
          toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!')
        } else {
          toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!')
        }
      }
    })

    const product = data?.data?.result

    if (isLoading) {
      return <div className="min-h-[60vh] flex items-center justify-center text-xl">Đang tải dữ liệu...</div>
    }

    if (!product) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in'>
                <div className='text-6xl mb-4'>🔍</div>
                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Không tìm thấy sản phẩm</h2>
                <button
                onClick={() => navigate('/')}
                className='bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition shadow-sm hover:shadow-md cursor-pointer mt-4'
                >
                Về trang chủ
                </button>
            </div>
        )
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in'>
        <nav className='flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8'>
            <Link to='/' className='hover:text-slate-800 transition'>Home</Link>
            <span>/</span>
            <Link to='/products' className='hover:text-slate-800 transition'>Products</Link>
            <span>/</span>
            <span className='text-slate-600 truncate max-w-[200px] sm:max-w-none'>{product.name}</span>
        </nav>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100/80 mb-12'>
            
            <div className='flex flex-col gap-4'>
            <div className='aspect-square rounded-2xl bg-slate-50 border border-slate-100/60 p-8 flex items-center justify-center overflow-hidden relative group'>
                <img 
                src={product.image} 
                alt={product.name}
                className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out'
                />
            </div>
            </div>
            <div className='flex flex-col justify-between'>
            <div>
                <h1 className='text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-snug mb-4'>
                {product.name}
                </h1>
                <div className='flex items-center gap-2 mb-6'>
                <div className='flex text-amber-400'>
                    {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                        key={i} 
                        className={`w-4 h-4 fill-current ${i < Math.floor(product.rating || 5) ? 'text-amber-400' : 'text-slate-200'}`} 
                        viewBox='0 0 20 20'
                    >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    ))}
                </div>
                <span className='text-xs font-bold text-slate-500'>
                    Lượt xem: {product.view || 0} | Đã bán: {product.sold || 0}
                </span>
                </div>
                <div className='flex items-center gap-1.5 text-xs font-bold mb-6'>
                <span className={`w-2 h-2 rounded-full ${product.quantity > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={product.quantity > 0 ? 'text-emerald-600' : 'text-rose-500'}>
                    {product.quantity > 0 ? `Còn hàng (${product.quantity} sản phẩm)` : 'Hết hàng'}
                </span>
                </div>
                <div className='bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8'>
                <span className='text-xs font-semibold text-slate-400 block mb-1'>Giá bán chính thức</span>
                <div className='flex items-baseline gap-3 flex-wrap'>
                    <span className='text-3xl font-black text-rose-600'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                    {product.price_before_discount && (
                    <span className='text-base line-through text-slate-400 font-semibold'>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price_before_discount)}
                    </span>
                    )}
                </div>
                </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                <button 
                onClick={() => addToCartMutation.mutate()}
                disabled={product.quantity <= 0}
                className={`flex-1 py-4 rounded-xl font-bold tracking-wide transition shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer ${
                    product.quantity > 0 
                    ? 'bg-slate-900 text-white hover:bg-blue-600' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                >
                Thêm vào giỏ
                </button>
            </div>
            </div>
        </div>
        <div className='bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100/80'>
            <h2 className='text-xl font-black text-slate-800 mb-6 pb-4 border-b border-slate-100'>
            Mô tả sản phẩm
            </h2>
            <p className='text-slate-600 leading-relaxed whitespace-pre-wrap'>
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </p>
        </div>
        </div>
    )
}
