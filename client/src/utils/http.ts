import axios, { AxiosError, HttpStatusCode, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from './auth'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/'

class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL,
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
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === 'users/login' || url === 'users/register') {
          const data = response.data as { result: { access_token: string; refresh_token: string } }
          this.accessToken = data.result.access_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(data.result.refresh_token)
        } else if (url === 'users/logout') {
          this.accessToken = ''
          clearLS()
        } else if (url === 'users/refresh-token') {
          const data = response.data as { result: { access_token: string; refresh_token: string } }
          this.accessToken = data.result.access_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(data.result.refresh_token)
        }
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
        const requestUrl = originalRequest?.url || ''

        if (
          error.response?.status === HttpStatusCode.Unauthorized &&
          originalRequest &&
          !originalRequest._retry &&
          !requestUrl.includes('users/login') &&
          !requestUrl.includes('users/register') &&
          !requestUrl.includes('users/refresh-token')
        ) {
          const refresh_token = getRefreshTokenFromLS()
          if (refresh_token) {
            originalRequest._retry = true
            try {
              const res = await axios.post(`${baseURL}users/refresh-token`, { refresh_token })
              this.accessToken = res.data.result.access_token
              setAccessTokenToLS(this.accessToken)
              setRefreshTokenToLS(res.data.result.refresh_token)
              originalRequest.headers.authorization = `Bearer ${this.accessToken}`
              return this.instance(originalRequest)
            } catch {
              clearLS()
              this.accessToken = ''
              window.location.href = '/login'
              return Promise.reject(error)
            }
          }
        }

        console.error('API Error:', error.response?.status, error.response?.data)
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: { message?: string } | undefined = error.response?.data as { message?: string }
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
