export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token') || ''
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  window.dispatchEvent(new Event('clearLS'))
}
