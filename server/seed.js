import { MongoClient, ObjectId } from 'mongodb'
import { config } from 'dotenv'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pc.bagchof.mongodb.net/?appName=PC`

const laptops = [
  {
    name: 'MSI GS66 Stealth 10SGS-032 15.6" 300Hz 3ms Ultra Thin and Light Gaming Laptop Intel Core i7-10875H RTX 2080 Super 32GB 1TB NVMe SSD Win10 PRO VR Ready',
    slug: 'msi-gs66-stealth-10sgs-032',
    description: 'The GS66 Stealth is a robust portable laptop packed with up to 10th Gen. Intel® Core™ i9 processor and the NVIDIA® GeForce RTX™ 2080 SUPER graphics.',
    price: 65000000,
    price_before_discount: 70000000,
    quantity: 10,
    sold: 5,
    view: 120,
    rating: 5,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI GT76 Titan DT 10SGS-055 17.3" 300Hz 3ms Gaming Laptop Intel Core i9-10900K RTX 2080 Super 64GB 2TB NVMe SSD Win10 PRO',
    slug: 'msi-gt76-titan-dt-10sgs-055',
    description: 'The GT76 Titan is the most extreme Titan ever created. The desktop-level performance comes from a desktop Intel® Core™ i9 processor.',
    price: 95000000,
    price_before_discount: 100000000,
    quantity: 5,
    sold: 2,
    view: 300,
    rating: 4.8,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI GL65 Leopard 10SFK-062 15.6" FHD 144Hz 3ms Thin Bezel Gaming Laptop Intel Core i7-10750H RTX2070 16GB 512GB NVMe SSD Win 10',
    slug: 'msi-gl65-leopard-10sfk-062',
    description: 'The GL65 Leopard equips the latest 10th Gen. Intel® Core™ i7 processor and NVIDIA® GeForce RTX™ 2070 graphics.',
    price: 35000000,
    price_before_discount: 38000000,
    quantity: 20,
    sold: 15,
    view: 500,
    rating: 4.5,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI GE66 Raider 10SFS-052 15.6" 300Hz 3ms Gaming Laptop Intel Core i7-10875H RTX 2070 Super 32GB 1TB NVMe SSD Win10',
    slug: 'msi-ge66-raider-10sfs-052',
    description: 'The GE66 Raider is the cross between aesthetics and performance, the keys to a solid laptop.',
    price: 55000000,
    price_before_discount: 58000000,
    quantity: 8,
    sold: 8,
    view: 210,
    rating: 4.9,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI GF63 Thin 9SC-066 15.6" Gaming Laptop, Thin Bezel, Intel Core i7-9750H, NVIDIA GeForce GTX1650, 16GB, 512GB NVMe SSD',
    slug: 'msi-gf63-thin-9sc-066',
    description: 'GF63 Thin brings thin and light gaming to the mainstream, featuring a thin bezel display with aluminum hairbrush aesthetics.',
    price: 25000000,
    price_before_discount: 28000000,
    quantity: 30,
    sold: 25,
    view: 800,
    rating: 4.2,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  }
]

async function seed() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)
    await db.collection('products').insertMany(laptops)
    console.log('Successfully seeded MSI laptops!')
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    await client.close()
  }
}

seed()
