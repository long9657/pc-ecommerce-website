import http from '../utils/http'

export function RegisterAcount(body: { name : string; username : string; email: string; password: string ; address : string; phone : string}) {
  return http.post('register', body)
}
export function LoginAccount(body: { username: string; password: string }) {
  return http.post('login', body)
}
