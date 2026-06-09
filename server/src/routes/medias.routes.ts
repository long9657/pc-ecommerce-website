import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/wrap'

const mediasRouter = Router()

mediasRouter.post('/upload-image', wrapRequestHandler(uploadImageController))

export default mediasRouter
