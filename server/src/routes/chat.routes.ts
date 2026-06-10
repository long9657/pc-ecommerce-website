import { Router } from 'express'
import { wrapRequestHandler } from '../utils/wrap'
import { chatController } from '../controllers/chat.controllers'

const chatRouter = Router()

chatRouter.post('/', wrapRequestHandler(chatController))

export default chatRouter
