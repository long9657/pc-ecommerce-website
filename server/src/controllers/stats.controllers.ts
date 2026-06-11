import { Request, Response } from 'express'
import statsService from '../services/stats.services'

export const getDashboardStatsController = async (req: Request, res: Response) => {
  const stats = await statsService.getDashboardStats()
  return res.json({
    message: 'Get dashboard stats successfully',
    data: stats
  })
}
