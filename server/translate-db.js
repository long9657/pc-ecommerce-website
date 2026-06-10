import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pc.bagchof.mongodb.net/?appName=PC`

const categoryTranslations = {
  "Laptop": "Laptops",
  "PC & Màn Hình": "Desktop PCs",
  "Phụ Kiện": "Accessories",
  "Điện Thoại": "Smartphones",
  "Linh Kiện PC": "PC Parts"
}

const productReplacements = [
  ['Chuột', 'Mouse'],
  ['Lót chuột', 'Mousepad'],
  ['Bàn phím cơ', 'Mechanical Keyboard'],
  ['Bàn phím', 'Keyboard'],
  ['Tai nghe', 'Headset'],
  ['Card Màn Hình', 'Graphics Card'],
  ['Bo mạch chủ', 'Motherboard'],
  ['Tản nhiệt nước', 'Liquid Cooler'],
  ['Tản nhiệt', 'Cooler'],
  ['Nguồn máy tính', 'Power Supply'],
  ['Ổ cứng SSD', 'SSD'],
  ['Ổ cứng', 'Hard Drive'],
  ['Vỏ Case', 'PC Case'],
  ['Case máy tính', 'PC Case'],
  ['Màn hình', 'Monitor'],
  ['Điện thoại di động', 'Smartphone'],
  ['Điện thoại', 'Smartphone']
]

async function migrate() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)
    
    // Translate Categories
    for (const [vn, en] of Object.entries(categoryTranslations)) {
      await db.collection('categories').updateOne(
        { name: vn },
        { $set: { name: en } }
      )
    }
    console.log("Translated categories!")

    // Translate Products
    const products = await db.collection('products').find({}).toArray()
    let count = 0
    for (const p of products) {
      let newName = p.name
      for (const [vn, en] of productReplacements) {
        // Replace at the beginning of the string or anywhere
        // Actually, Vietnamese often has it at the beginning. "Chuột Logitech" -> "Mouse Logitech" -> "Logitech Mouse"
        // Let's just do a simple replace first. "Logitech Mouse" sounds better, but we'll just do "Mouse Logitech" for now or fix it up.
        // Actually: if name starts with "Chuột " -> replace with "" and append " Mouse"
        const regex = new RegExp(`^${vn}\\s+`, 'i')
        if (regex.test(newName)) {
          newName = newName.replace(regex, '') + ' ' + en
        }
      }
      if (newName !== p.name) {
        await db.collection('products').updateOne(
          { _id: p._id },
          { $set: { name: newName } }
        )
        count++
      }
    }
    console.log(`Translated ${count} product names!`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}
migrate()
