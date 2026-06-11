import { Router } from 'express'
import { getDashboardStatsController } from '../controllers/stats.controllers'
import { accessTokenValidator, isAdminValidator } from '../middlewares/user.middlewares'
import { wrapRequestHandler } from '../utils/wrap'

const statsRouter = Router()

statsRouter.get(
  '/',
  accessTokenValidator,
  isAdminValidator,
  wrapRequestHandler(getDashboardStatsController)
)

export default statsRouter
