import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pc.bagchof.mongodb.net/?appName=PC`

async function migratePrices() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)

    // Find products with extremely high prices (likely stored in VND instead of USD)
    const oldProducts = await db.collection('products').find({ price: { $gt: 10000 } }).toArray()

    let updatedCount = 0
    for (const product of oldProducts) {
      // Divide by 25,000 to convert VND to USD
      const newPrice = Math.round(product.price / 25000)
      const newPriceBeforeDiscount = Math.round(product.price_before_discount / 25000)

      await db.collection('products').updateOne(
        { _id: product._id },
        { 
          $set: { 
            price: newPrice,
            price_before_discount: newPriceBeforeDiscount 
          } 
        }
      )
      updatedCount++
    }

    console.log(`Successfully migrated ${updatedCount} products from VND to USD.`)

  } catch (error) {
    console.error('Error migrating prices:', error)
  } finally {
    await client.close()
  }
}

migratePrices()
