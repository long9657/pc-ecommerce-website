import http from '../utils/http'

export function getProducts(params?: any) {
  return http.get('products', { params })
}

export function getProductDetail(id: string) {
  return http.get(`products/${id}`)
}
