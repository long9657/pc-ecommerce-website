import { MongoClient, ObjectId } from 'mongodb'
import { config } from 'dotenv'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pc.bagchof.mongodb.net/?appName=PC`

const desktops = [
  {
    name: 'MSI MEG Trident X 10TE-1262US Small Form Factor Gaming Desktop Intel Core i9-10900K RTX 3080 32GB 1TB NVMe SSD',
    slug: 'msi-meg-trident-x-10te-1262us',
    description: 'The MEG Trident X is the most compact gaming desktop. Packed in a 10 liters volume case, it has components that are typically found in full tower cases.',
    price: 85000000,
    price_before_discount: 90000000,
    quantity: 10,
    sold: 5,
    view: 120,
    rating: 5,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI MPG Trident AS 10TG-1011US Gaming Desktop Core i7-10700F RTX 3060 Ti 16GB 1TB NVMe SSD',
    slug: 'msi-mpg-trident-as-10tg-1011us',
    description: 'The MPG Trident AS takes charge by being the most compact gaming desktop. It is housed in a 10 liters volume case.',
    price: 45000000,
    price_before_discount: 48000000,
    quantity: 15,
    sold: 8,
    view: 200,
    rating: 4.8,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI MAG Infinite S 10SI-031US Gaming Desktop Core i5-10400F GTX 1660 Super 8GB 512GB SSD',
    slug: 'msi-mag-infinite-s-10si-031us',
    description: 'Infinite Series has its own unique design, combining elements of a traditional gaming PC with modern, aggressive angles.',
    price: 28000000,
    price_before_discount: 30000000,
    quantity: 20,
    sold: 12,
    view: 150,
    rating: 4.5,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI MEG Infinite X 10TE-842US Gaming Desktop Core i9-10900KF RTX 3080 32GB 2TB HDD + 1TB SSD',
    slug: 'msi-meg-infinite-x-10te-842us',
    description: 'The MEG Infinite X series is built for gamers with a never-ending desire to game and want endless possibilities to play the way they want.',
    price: 95000000,
    price_before_discount: 100000000,
    quantity: 5,
    sold: 2,
    view: 300,
    rating: 5,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI Nightblade MI3 8RC-052EU Gaming Desktop Core i5-8400 GTX 1060 8GB 1TB HDD + 128GB SSD',
    slug: 'msi-nightblade-mi3-8rc-052eu',
    description: 'Nightblade series houses highly capable PC components in a compact shell, providing an immense gaming experience.',
    price: 22000000,
    price_before_discount: 25000000,
    quantity: 8,
    sold: 10,
    view: 400,
    rating: 4.2,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'MSI GL Series Prebuilt Gaming Desktop PC Core i7-11700F RTX 3070 16GB RAM 1TB SSD',
    slug: 'msi-gl-series-prebuilt-gaming-desktop',
    description: 'A prebuilt desktop system utilizing the GL series aesthetic, bringing reliable performance for heavy gaming.',
    price: 55000000,
    price_before_discount: 60000000,
    quantity: 12,
    sold: 15,
    view: 500,
    rating: 4.9,
    category_id: new ObjectId(),
    image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80&w=400'],
    created_at: new Date(),
    updated_at: new Date()
  }
]

async function seed() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)
    await db.collection('products').insertMany(desktops)
    console.log('Successfully seeded MSI desktops!')
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    await client.close()
  }
}

seed()
