import inStock from '../../assets/inStock.svg'
import checkAvalaibility from '../../assets/checkAvalaibility.svg'
import { Link } from 'react-router'
interface Product {
  id: number
  imageAlt: string
  imageSrc: string
  href: string
  name: string
  color: string
  price: string
  status: string
}
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div key={product.id} className='group relative'>
      {product.status === 'inStock' ? (
        <img src={inStock} alt='In Stock' />
      ) : (
        <img src={checkAvalaibility} alt='Check Availability' />
      )}
      <img
        alt={product.imageAlt}
        src={product.imageSrc}
        className='aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80'
      />
      <div className='mt-4 flex justify-between'>
        <div>
          <h3 className='text-sm text-gray-700'>
            <Link to={product.href}>
              <span aria-hidden='true' className='absolute inset-0' />
              {product.name}
            </Link>
          </h3>
          <p className='mt-1 text-sm text-gray-500'>{product.color}</p>
        </div>
        <p className='text-sm font-medium text-gray-900'>{product.price}</p>
      </div>
    </div>
  )
}
