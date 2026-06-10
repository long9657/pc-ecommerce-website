import { config } from 'dotenv'
import database from '../services/database.services'
import { isBrokenImageUrl, resolveProductImage } from '../utils/image'

config()

async function main() {
  await database.connect()
  const products = await database.products.find({}).toArray()
  let fixed = 0

  for (const product of products) {
    if (!isBrokenImageUrl(product.image)) continue
    const newImage = resolveProductImage(product)
    await database.products.updateOne(
      { _id: product._id },
      {
        $set: {
          image: newImage,
          images: [newImage],
          updated_at: new Date()
        }
      }
    )
    console.log(`Fixed: ${product.name}`)
    fixed++
  }

  const categories = await database.categories.find({}).toArray()
  for (const category of categories) {
    if (!isBrokenImageUrl(category.image)) continue
    const newImage = resolveProductImage({ name: category.name, image: category.image })
    await database.categories.updateOne(
      { _id: category._id },
      { $set: { image: newImage, updated_at: new Date() } }
    )
    console.log(`Fixed category: ${category.name}`)
    fixed++
  }

  console.log(`Done. Updated ${fixed} records.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
