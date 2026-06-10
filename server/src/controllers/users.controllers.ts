import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqBody } from '~/models/requests/user.requests'
import User from '~/models/schemas/user.schemas'
import userServices from '~/services/users.services'
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await userServices.login(user_id.toString())
  console.log(user)
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userServices.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const result = await userServices.logout(refresh_token)
  return res.json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS,
    result
  })
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const user_id = req.decoded_refresh_token.user_id
  const result = await userServices.refreshToken(refresh_token, user_id)
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const user_id = req.decoded_authorization.user_id
  const result = await userServices.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result
  })
}

export const updateMeController = async (req: Request, res: Response) => {
  const user_id = req.decoded_authorization.user_id
  const result = await userServices.updateMe(user_id, req.body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
}

export const getAllUsersAdminController = async (req: Request, res: Response) => {
  const result = await userServices.getAllUsersAdmin()
  return res.json({
    message: 'Lấy danh sách người dùng thành công',
    result
  })
}

export const deleteUserAdminController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await userServices.deleteUserAdmin(id)
  return res.json({
    message: 'Xóa người dùng thành công',
    result
  })
}
