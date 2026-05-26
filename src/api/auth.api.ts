import http from '../utils/http'

export function RegisterAcount(body: { name: string; email: string; password: string; confirm_password: string; date_of_birth: string }) {
  return http.post('users/register', body)
}
export function LoginAccount(body: { email: string; password: string }) {
  return http.post('users/login', body)
}
