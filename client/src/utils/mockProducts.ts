export interface Product {
  id: string
  name: string
  brand: 'MSI' | 'Razer' | 'Gigabyte' | 'ASUS ROG'
  image: string
  category: 'Laptops' | 'Desktop PCs' | 'Peripherals' | 'PC Parts'
  price: number
  oldPrice?: number
  inStock: boolean
  rating: number
  reviewsCount: number
  badge?: string
  specs: {
    cpu?: string
    gpu?: string
    ram?: string
    switchType?: string
    sensor?: string
    chipset?: string
    power?: string
  }
}

export const MOCK_PRODUCTS: Product[] = [
  // --- LAPTOPS ---
  {
    id: 'l1',
    name: 'MSI Raider GE78 HX Gaming Laptop',
    brand: 'MSI',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400',
    category: 'Laptops',
    price: 2499.0,
    oldPrice: 2799.0,
    inStock: true,
    rating: 4.9,
    reviewsCount: 12,
    badge: 'Hot Item',
    specs: { cpu: 'Core i9-14900HX', gpu: 'RTX 4070', ram: '16GB DDR5' }
  },
  {
    id: 'l2',
    name: 'Razer Blade 16 Gaming Laptop',
    brand: 'Razer',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400',
    category: 'Laptops',
    price: 2999.0,
    oldPrice: 3299.0,
    inStock: true,
    rating: 4.8,
    reviewsCount: 18,
    badge: 'New',
    specs: { cpu: 'Core i9-14900HX', gpu: 'RTX 4080', ram: '32GB DDR5' }
  },
  {
    id: 'l3',
    name: 'Razer Blade 14 Compact Gaming Laptop',
    brand: 'Razer',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400',
    category: 'Laptops',
    price: 2199.0,
    inStock: false,
    rating: 4.5,
    reviewsCount: 8,
    badge: 'Out of Stock',
    specs: { cpu: 'Ryzen 9 8945HS', gpu: 'RTX 4070', ram: '16GB DDR5' }
  },
  {
    id: 'l4',
    name: 'ASUS ROG Zephyrus G16 OLED',
    brand: 'ASUS ROG',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
    category: 'Laptops',
    price: 2599.0,
    inStock: true,
    rating: 4.7,
    reviewsCount: 22,
    badge: 'Best Seller',
    specs: { cpu: 'Intel Core Ultra 9', gpu: 'RTX 4070', ram: '32GB LPDDR5X' }
  },
  {
    id: 'l5',
    name: 'Gigabyte AORUS 17X Gaming Laptop',
    brand: 'Gigabyte',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=400',
    category: 'Laptops',
    price: 3299.0,
    oldPrice: 3599.0,
    inStock: true,
    rating: 5.0,
    reviewsCount: 5,
    badge: 'Ultimate',
    specs: { cpu: 'Core i9-14900HX', gpu: 'RTX 4090', ram: '32GB DDR5' }
  },

  // --- DESKTOP PCS ---
  {
    id: 'd1',
    name: 'MSI Aegis RS Gaming Desktop',
    brand: 'MSI',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400',
    category: 'Desktop PCs',
    price: 1899.0,
    oldPrice: 2199.0,
    inStock: true,
    rating: 4.9,
    reviewsCount: 24,
    badge: 'Best Seller',
    specs: { cpu: 'Core i7-14700KF', gpu: 'RTX 4070 Ti Super', ram: '32GB DDR5' }
  },
  {
    id: 'd2',
    name: 'ASUS ROG Strix G16CH Gaming Desktop',
    brand: 'ASUS ROG',
    image: 'https://images.unsplash.com/photo-1598501479155-90b5efd3c7f0?auto=format&fit=crop&q=80&w=400',
    category: 'Desktop PCs',
    price: 1499.0,
    oldPrice: 1699.0,
    inStock: true,
    rating: 4.6,
    reviewsCount: 14,
    badge: 'Promo',
    specs: { cpu: 'Core i7-13700F', gpu: 'RTX 4060 Ti', ram: '16GB DDR5' }
  },
  {
    id: 'd3',
    name: 'Razer Tomahawk Elite Desktop',
    brand: 'Razer',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=400',
    category: 'Desktop PCs',
    price: 3499.0,
    inStock: true,
    rating: 4.8,
    reviewsCount: 7,
    badge: 'Limited',
    specs: { cpu: 'Core i9-14900KS', gpu: 'RTX 4090', ram: '64GB DDR5' }
  },
  {
    id: 'd4',
    name: 'Gigabyte AORUS Model S Desktop',
    brand: 'Gigabyte',
    image: 'https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&fit=crop&q=80&w=400',
    category: 'Desktop PCs',
    price: 1799.0,
    inStock: true,
    rating: 4.7,
    reviewsCount: 9,
    specs: { cpu: 'Ryzen 7 7800X3D', gpu: 'RTX 4075 Super', ram: '32GB DDR5' }
  },

  // --- PERIPHERALS ---
  {
    id: 'p1',
    name: 'Razer BlackWidow V4 Pro Mechanical Keyboard',
    brand: 'Razer',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400',
    category: 'Peripherals',
    price: 229.0,
    inStock: true,
    rating: 4.8,
    reviewsCount: 31,
    badge: 'Premium',
    specs: { switchType: 'Razer Green Clicky', ram: 'N/A' }
  },
  {
    id: 'p2',
    name: 'Razer DeathAdder V3 Pro Wireless Mouse',
    brand: 'Razer',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400',
    category: 'Peripherals',
    price: 149.0,
    inStock: true,
    rating: 4.9,
    reviewsCount: 45,
    badge: 'Esports Ready',
    specs: { sensor: 'Focus Pro 30K Optical' }
  },
  {
    id: 'p3',
    name: 'ASUS ROG Harpe Ace Gaming Mouse',
    brand: 'ASUS ROG',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3290455651?auto=format&fit=crop&q=80&w=400',
    category: 'Peripherals',
    price: 129.0,
    inStock: true,
    rating: 4.7,
    reviewsCount: 19,
    specs: { sensor: 'ROG AimPoint 36K' }
  },
  {
    id: 'p4',
    name: 'MSI Force GC30 V2 Wireless Controller',
    brand: 'MSI',
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=400',
    category: 'Peripherals',
    price: 39.0,
    oldPrice: 49.0,
    inStock: true,
    rating: 4.3,
    reviewsCount: 52,
    specs: { switchType: 'Dual Vibration Motors' }
  },

  // --- PC PARTS ---
  {
    id: 'pt1',
    name: 'Gigabyte GeForce RTX 4080 Super AERO OC',
    brand: 'Gigabyte',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400',
    category: 'PC Parts',
    price: 1099.0,
    inStock: true,
    rating: 4.9,
    reviewsCount: 15,
    badge: 'Creator edition',
    specs: { gpu: 'RTX 4080 Super', ram: '16GB GDDR6X' }
  },
  {
    id: 'pt2',
    name: 'ASUS ROG Thor 1000W Platinum II PSU',
    brand: 'ASUS ROG',
    image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=400',
    category: 'PC Parts',
    price: 359.0,
    inStock: true,
    rating: 4.8,
    reviewsCount: 28,
    badge: 'OLED Display',
    specs: { power: '1000W 80+ Platinum' }
  },
  {
    id: 'pt3',
    name: 'MSI MPG Z790 EDGE TI MAX MOTHERBOARD',
    brand: 'MSI',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
    category: 'PC Parts',
    price: 379.0,
    oldPrice: 399.0,
    inStock: true,
    rating: 4.6,
    reviewsCount: 11,
    specs: { chipset: 'Intel Z790 LGA 1700' }
  }
]
