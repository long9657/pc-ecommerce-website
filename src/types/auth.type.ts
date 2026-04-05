import type { User } from './user.type'
import type ResponseApi from './response.type'
export type AuthApi = ResponseApi<{
  acess_token: string
  expires: string
  user: User
}>
