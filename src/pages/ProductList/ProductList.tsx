import { Link } from 'react-router'
import ProductCard from '../../components/ProductCard/ProductCard'
const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    status: '',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black'
  },
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    status: 'inStock',

    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg',
    imageAlt: "Front of men's Basic Tee in white.",
    price: '$35',
    color: 'Aspen White'
  },
  {
    id: 3,
    name: 'Basic Tee',
    href: '#',
    status: 'inStock',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg',
    imageAlt: "Front of men's Basic Tee in dark gray.",
    price: '$35',
    color: 'Charcoal'
  },
  {
    id: 4,
    name: 'Artwork Tee',
    href: '#',
    status: 'inStock',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg',
    imageAlt: "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: '$35',
    color: 'Iso Dots'
  }
]

export default function Example() {
  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        <div className='flex justify-between items-end'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900'>New Products</h2>
          <Link to='/' className='text-sm font-medium text-blue-600 hover:text-blue-500  underline underline-offset-3'>
            See all products{' '}
          </Link>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {products.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
