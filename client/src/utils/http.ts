import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS } from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'http://localhost:3000/',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === 'users/login' || url === 'users/register') {
          const data = response.data as any
          this.accessToken = data.result.access_token
          setAccessTokenToLS(this.accessToken)
        } else if (url === 'users/logout') {
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        console.error('API Error:', error.response?.status, error.response?.data)
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLS()
          this.accessToken = ''
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }
}
export const http = new Http().instance
export default http
