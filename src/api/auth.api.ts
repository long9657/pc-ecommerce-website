import http from '../utils/http'

export function RegisterAcount(body: { email: string; password: string }) {
  return http.post('register', body)
}
export function LoginAccount(body: { email: string; password: string }) {
  return http.post('login', body)
}
