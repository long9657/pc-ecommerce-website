import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import { config } from 'dotenv'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
import User from '~/models/schemas/user.schemas'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Category from '~/models/schemas/Category.schema'
import Product from '~/models/schemas/Product.schema'
import Purchase from '~/models/schemas/Purchase.schema'
import Order from '~/models/schemas/Order.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pc.bagchof.mongodb.net/?appName=PC`

class Database {
  private db: Db
  private client: MongoClient
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.client.connect()
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // await this.client.close()
    }
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USER_COLLECTIONS as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTIONS as string)
  }

  get categories(): Collection<Category> {
    return this.db.collection(process.env.DB_CATEGORIES_COLLECTIONS || 'categories')
  }

  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTIONS || 'products')
  }

  get purchases(): Collection<Purchase> {
    return this.db.collection(process.env.DB_PURCHASES_COLLECTIONS || 'purchases')
  }

  get orders(): Collection<Order> {
    return this.db.collection(process.env.DB_ORDERS_COLLECTIONS || 'orders')
  }
}

const database = new Database()
export default database
