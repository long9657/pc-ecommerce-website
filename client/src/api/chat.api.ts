import http from '../utils/http'

export const sendChatMessage = (message: string, history: any[]) => {
  return http.post('/chat', { message, history })
}
