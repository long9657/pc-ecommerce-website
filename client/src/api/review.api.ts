import http from '../utils/http'

export const getReviews = (productId: string) => {
  return http.get(`/reviews/${productId}`)
}

export const createReview = (productId: string, data: { rating: number; text: string }) => {
  return http.post(`/reviews/${productId}`, data)
}
