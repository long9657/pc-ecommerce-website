import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pc.bagchof.mongodb.net/?appName=PC`

async function migrate() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)
    
    // Assign "black" to some, "red" to others, "silver" to others randomly or based on name
    const products = await db.collection('products').find({}).toArray()
    
    let updated = 0
    for (const product of products) {
      let color = 'black'
      const name = product.name.toLowerCase()
      if (name.includes('red') || name.includes('suprim') || name.includes('asus')) {
        color = 'red'
      } else if (name.includes('silver') || name.includes('titan')) {
        color = 'silver'
      } else if (name.includes('white') || name.includes('stealth')) {
        color = 'white'
      }
      
      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: { color } }
      )
      updated++
    }
    
    console.log(`Successfully assigned color to ${updated} products!`)
  } catch (error) {
    console.error('Error migrating data:', error)
  } finally {
    await client.close()
  }
}

migrate()
