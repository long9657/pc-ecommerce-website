import http from '../utils/http'
import { getRefreshTokenFromLS } from '../utils/auth'

export function RegisterAcount(body: { name: string; email: string; password: string; confirm_password: string; date_of_birth: string }) {
  return http.post('users/register', body)
}
export function LoginAccount(body: { email: string; password: string }) {
  return http.post('users/login', body)
}
export function getMe() {
  return http.get('users/me')
}
export function updateMe(body: { name: string; phone?: string; address?: string }) {
  return http.patch('users/me', body)
}
export function logoutAccount() {
  const refresh_token = getRefreshTokenFromLS()
  return http.post('users/logout', { refresh_token })
}


