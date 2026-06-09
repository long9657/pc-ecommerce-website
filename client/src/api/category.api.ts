import http from '../utils/http'

export function getCategories() {
  return http.get('categories')
}
