import databaseService from './database.services'
import { OrderStatus } from '../models/schemas/Order.schema'

class StatsService {
  async getDashboardStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todayRevenue, newOrdersCount, outOfStockCount, newCustomersCount] = await Promise.all([
      // 1. Revenue today
      databaseService.orders.aggregate([
        { $match: { created_at: { $gte: today }, status: { $ne: OrderStatus.CANCELLED } } },
        { $group: { _id: null, total: { $sum: '$final_price' } } }
      ]).toArray(),
      // 2. New orders today
      databaseService.orders.countDocuments({ created_at: { $gte: today } }),
      // 3. Out of stock products
      databaseService.products.countDocuments({ quantity: 0 }),
      // 4. New customers today
      databaseService.users.countDocuments({ created_at: { $gte: today } })
    ])

    return {
      todayRevenue: todayRevenue[0]?.total || 0,
      newOrdersCount,
      outOfStockCount,
      newCustomersCount
    }
  }
}

const statsService = new StatsService()
export default statsService
