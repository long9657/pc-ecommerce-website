import http from '../utils/http'

export function getCategories() {
  return http.get('categories')
}

export function createCategory(data: { name: string; image: string }) {
  return http.post('categories', data)
}

export function updateCategory(id: string, data: { name?: string; image?: string }) {
  return http.put(`categories/${id}`, data)
}

export function deleteCategory(id: string) {
  return http.delete(`categories/${id}`)
}
