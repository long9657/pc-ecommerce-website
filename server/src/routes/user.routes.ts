import { Router } from 'express'
import { getMeController, loginController, logoutController, refreshTokenController, registerController, getAllUsersAdminController, deleteUserAdminController, updateMeController } from '~/controllers/users.controllers'
import { accessTokenValidator, loginValidator, refreshTokenValidator, registerValidator, isAdminValidator, updateMeValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/wrap'
const userRouter = Router()

// define the home page route
userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

userRouter.post(
  '/logout',
  accessTokenValidator,
  refreshTokenValidator,
  wrapRequestHandler(logoutController)
)

userRouter.post(
  '/refresh-token',
  refreshTokenValidator,
  wrapRequestHandler(refreshTokenController)
)

userRouter.get(
  '/me',
  accessTokenValidator,
  wrapRequestHandler(getMeController)
)

userRouter.patch(
  '/me',
  accessTokenValidator,
  updateMeValidator,
  wrapRequestHandler(updateMeController)
)

userRouter.get(
  '/admin',
  accessTokenValidator,
  isAdminValidator,
  wrapRequestHandler(getAllUsersAdminController)
)

userRouter.delete(
  '/admin/:id',
  accessTokenValidator,
  isAdminValidator,
  wrapRequestHandler(deleteUserAdminController)
)

export default userRouter
