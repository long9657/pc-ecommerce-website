import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pc.bagchof.mongodb.net/?appName=PC`

const categoryTranslations = {
  "Accessories": "Networking Devices",
  "Smartphones": "Printers & Scanners"
}

async function migrate() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)
    
    // Translate Categories
    for (const [oldName, newName] of Object.entries(categoryTranslations)) {
      await db.collection('categories').updateOne(
        { name: oldName },
        { $set: { name: newName } }
      )
    }
    console.log("Renamed categories to match Figma!")

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}
migrate()
