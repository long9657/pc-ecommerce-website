import http from '../utils/http'

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
export function forgotPassword(body: { email: string }) {
  return http.post('users/forgot-password', body)
}
export function resetPassword(body: { forgot_password_token: string; password: string; confirm_password: string }) {
  return http.post('users/reset-password', body)
}
