import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pc.bagchof.mongodb.net/?appName=PC`

const DATA_DIR = 'C:\\Users\\long\\Downloads\\pc-part-dataset-main\\data\\json'

// Helper to convert filename to nice category name
function formatCategoryName(filename) {
  return filename
    .replace('.json', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function seed() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))

    for (const file of files) {
      const categoryName = formatCategoryName(file)
      
      // Upsert Category
      let category = await db.collection('categories').findOne({ name: categoryName })
      if (!category) {
        const result = await db.collection('categories').insertOne({ name: categoryName })
        category = { _id: result.insertedId, name: categoryName }
        console.log(`Created category: ${categoryName}`)
      }

      // Read JSON
      const rawData = fs.readFileSync(path.join(DATA_DIR, file), 'utf8')
      const items = JSON.parse(rawData).slice(0, 8) // Take 8 items per category

      const productsToInsert = items.map((item) => {
        // Extract common fields
        const name = item.name
        const price = item.price || Math.floor(Math.random() * 500) + 50 // Default random price if null

        // Remove name and price from specs
        const { name: _n, price: _p, ...specs } = item

        return {
          name,
          price, // Price in USD
          price_before_discount: price * 1.2, // 20% fake discount
          quantity: Math.floor(Math.random() * 100) + 10,
          sold: Math.floor(Math.random() * 50),
          view: Math.floor(Math.random() * 200),
          rating: 4 + Math.random(),
          image: "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg", // generic placeholder
          category_id: category._id,
          color: "black",
          specs, // Storing all the hardware specific properties here
          created_at: new Date(),
          updated_at: new Date()
        }
      })

      if (productsToInsert.length > 0) {
        await db.collection('products').insertMany(productsToInsert)
        console.log(`Inserted ${productsToInsert.length} products for ${categoryName}`)
      }
    }

    console.log("Seeding complete!")

  } catch (error) {
    console.error('Error seeding:', error)
  } finally {
    await client.close()
  }
}

seed()
