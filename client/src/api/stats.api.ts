import http from '../utils/http'

export const getDashboardStats = () => {
  return http.get('/admin/stats')
}
