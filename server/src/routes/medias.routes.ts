import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/wrap'

const mediasRouter = Router()

mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  isAdminValidator,
  wrapRequestHandler(uploadImageController)
)

export default mediasRouter
