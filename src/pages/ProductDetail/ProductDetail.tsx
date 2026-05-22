import {Link, useNavigate, useParams} from 'react-router'
import { MOCK_PRODUCTS } from '../../utils/mockProducts'

export default function ProductDetail() {
    const {id} = useParams()
    const navigate = useNavigate()
    let result = [...MOCK_PRODUCTS]
    const product = result.find(p => p.id === id)

    if (!product) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in'>
                <div className='text-6xl mb-4'>🔍</div>
                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Product Not Found</h2>
                <p className='text-slate-500 mb-6 max-w-md'>
                Sorry, the product you are looking for does not exist or has been removed from our catalog.
                </p>
                <button
                onClick={() => navigate('/')}
                className='bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition shadow-sm hover:shadow-md cursor-pointer'
                >
                Back to Homepage
                </button>
            </div>
        )
    }
    const brandColors: Record<string, string> = {
        MSI: 'bg-red-50 text-red-600 border border-red-200/50',
        Razer: 'bg-emerald-50 text-emerald-600 border border-emerald-200/50',
        Gigabyte: 'bg-blue-50 text-blue-600 border border-blue-200/50',
        'ASUS ROG': 'bg-rose-50 text-rose-600 border border-rose-200/50'
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
                {product.badge && (
                <span className='absolute top-4 left-4 bg-slate-900 text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md shadow-sm z-10'>
                    {product.badge}
                </span>
                )}
                <img 
                src={product.image} 
                alt={product.name}
                className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out'
                />
            </div>
            </div>
            <div className='flex flex-col justify-between'>
            <div>
                <div className='flex items-center gap-3 mb-4'>
                <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full ${brandColors[product.brand] || 'bg-slate-100 text-slate-700'}`}>
                    {product.brand}
                </span>
                <span className='text-xs font-medium text-slate-400 uppercase tracking-wider'>
                    {product.category}
                </span>
                </div>
                <h1 className='text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-snug mb-4'>
                {product.name}
                </h1>
                <div className='flex items-center gap-2 mb-6'>
                <div className='flex text-amber-400'>
                    {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                        key={i} 
                        className={`w-4 h-4 fill-current ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'}`} 
                        viewBox='0 0 20 20'
                    >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    ))}
                </div>
                <span className='text-xs font-bold text-slate-500'>
                    {product.rating} / 5 ({product.reviewsCount} reviews)
                </span>
                </div>
                <div className='flex items-center gap-1.5 text-xs font-bold mb-6'>
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={product.inStock ? 'text-emerald-600' : 'text-rose-500'}>
                    {product.inStock ? 'In Stock (Ready to Ship)' : 'Out of Stock'}
                </span>
                </div>
                <div className='bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8'>
                <span className='text-xs font-semibold text-slate-400 block mb-1'>Special Offer Price</span>
                <div className='flex items-baseline gap-3 flex-wrap'>
                    <span className='text-3xl font-black text-slate-900'>
                    ${product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                    <span className='text-base line-through text-slate-400 font-semibold'>
                        ${product.oldPrice.toFixed(2)}
                    </span>
                    )}
                </div>
                </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                <button 
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-xl font-bold tracking-wide transition shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer ${
                    product.inStock 
                    ? 'bg-slate-900 text-white hover:bg-blue-600' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                >
                Add to Cart
                </button>
                <button 
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-xl font-bold tracking-wide transition shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer ${
                    product.inStock 
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100/80' 
                    : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                }`}
                >
                Buy Now
                </button>
            </div>
            </div>
        </div>
        <div className='bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100/80'>
            <h2 className='text-xl font-black text-slate-800 mb-6 pb-4 border-b border-slate-100'>
            Technical Specifications
            </h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4'>
            {Object.entries(product.specs).map(([key, value]) => {
                if (!value || value === 'N/A') return null;
                return (
                <div key={key} className='flex justify-between items-center py-3 border-b border-slate-50 text-sm'>
                    <span className='font-semibold text-slate-400 capitalize'>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className='font-bold text-slate-800'>{value}</span>
                </div>
                )
            })}
            </div>
        </div>
        </div>
    )
}
