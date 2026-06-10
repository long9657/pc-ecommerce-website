import User from '~/models/schemas/user.schemas'
import database from './database.services'
import { RegisterReqBody } from '~/models/requests/user.requests'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { hashPassword } from '~/utils/crypto'
import { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { sendResetPasswordEmail } from '~/utils/email'

config()

class UserServices {
  private signAccessandRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  async register(payload: RegisterReqBody) {
    const result = await database.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessandRefreshToken(user_id)
    await database.refreshTokens.insertOne(new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token }))
    return {
      access_token,
      refresh_token
    }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessandRefreshToken(user_id)
    await database.refreshTokens.insertOne(new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token }))
    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const user = await database.users.findOne({ email })
    return Boolean(user)
  }

  async logout(refresh_token: string) {
    await database.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: 'Logout success'
    }
  }

  async refreshToken(refresh_token: string, user_id: string) {
    const [access_token, new_refresh_token] = await this.signAccessandRefreshToken(user_id)
    await database.refreshTokens.updateOne(
      { token: refresh_token },
      {
        $set: {
          token: new_refresh_token,
          created_at: new Date()
        }
      }
    )
    return {
      access_token,
      refresh_token: new_refresh_token
    }
  }

  async getMe(user_id: string) {
    const user = await database.users.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )
    return user
  }

  async getAllUsersAdmin() {
    const users = await database.users
      .find({}, { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } })
      .sort({ created_at: -1 })
      .toArray()
    return users
  }

  async deleteUserAdmin(user_id: string) {
    const result = await database.users.deleteOne({ _id: new ObjectId(user_id) })
    // Cần xóa cả refresh token của user này để ép đăng xuất
    await database.refreshTokens.deleteMany({ user_id: new ObjectId(user_id) })
    return result
  }

  async forgotPassword(user_id: string, email: string) {
    const forgot_password_token = await signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken },
      options: {
        expiresIn: '15m'
      }
    })
    await database.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { forgot_password_token } }
    )
    await sendResetPasswordEmail(email, forgot_password_token)
    return {
      message: 'Vui lòng kiểm tra email của bạn để khôi phục mật khẩu'
    }
  }

  async resetPassword(user_id: string, password: string) {
    await database.users.updateOne(
      { _id: new ObjectId(user_id) },
      { 
        $set: { password: hashPassword(password), updated_at: new Date() },
        $unset: { forgot_password_token: '' as any } 
      }
    )
    // Đăng xuất khỏi mọi thiết bị sau khi đổi mật khẩu
    await database.refreshTokens.deleteMany({ user_id: new ObjectId(user_id) })
    return {
      message: 'Mật khẩu đã được thay đổi thành công'
    }
  }
}

const userServices = new UserServices()
export default userServices
