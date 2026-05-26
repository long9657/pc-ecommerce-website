import http from '../utils/http'

export const addToCart = (body: { product_id: string; buy_count: number }) => {
  return http.post('purchases/add-to-cart', body)
}

export const getPurchases = (params: { status: number }) => {
  return http.get('purchases', { params })
}

export const buyPurchases = (body: { purchase_ids: string[] }) => {
  return http.post('purchases/buy', body)
}

export const updatePurchase = (id: string, body: { buy_count: number }) => {
  return http.put(`purchases/update-purchase/${id}`, body)
}

export const deletePurchases = (body: { purchase_ids: string[] }) => {
  return http.delete('purchases', { data: body })
}
