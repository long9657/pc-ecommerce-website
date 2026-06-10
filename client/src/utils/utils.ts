import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
export function isAxiosErrorFunc<T>(error: unknown): error is AxiosError<T> {
  return isAxiosError(error)
}
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosErrorFunc(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

export const formatVND = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

export const formatVNDCompact = (price: number | string) => {
  const num = Number(price) || 0
  return `${num.toLocaleString('vi-VN')}₫`
}

const BROKEN_UNSPLASH_IDS = [
  'photo-1598327105666-5b89351cb31b',
  'photo-1563914945464-946766d6a2f7',
  'photo-1527814050087-379381547961'
]

const FALLBACK_BY_KEYWORD: { keywords: string[]; url: string }[] = [
  { keywords: ['galaxy', 'iphone', 'phone', 'smartphone', 'ipad', 'tablet'], url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600' },
  { keywords: ['laptop', 'macbook', 'notebook', 'xps', 'legion', 'strix'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600' },
  { keywords: ['rtx', 'gtx', 'gpu', 'graphic', 'geforce'], url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=600' },
  { keywords: ['cpu', 'intel', 'ryzen', 'processor', 'mainboard', 'motherboard'], url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600' },
  { keywords: ['ssd', 'hdd', 'hard drive', 'nvme'], url: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&q=80&w=600' },
  { keywords: ['ram', 'memory'], url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=600' },
  { keywords: ['keyboard', 'mouse', 'headset', 'speaker'], url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600' }
]

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600'

export const isBrokenImageUrl = (url?: string) => {
  if (!url) return true
  return BROKEN_UNSPLASH_IDS.some((id) => url.includes(id))
}

export const getFallbackImageForName = (name = '') => {
  const lower = name.toLowerCase()
  for (const item of FALLBACK_BY_KEYWORD) {
    if (item.keywords.some((kw) => lower.includes(kw))) return item.url
  }
  return DEFAULT_FALLBACK
}

export const resolveImageUrl = (image?: string, productName = '') => {
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000/').replace(/\/$/, '')
  if (!image || isBrokenImageUrl(image)) return getFallbackImageForName(productName)
  if (image.startsWith('http://') || image.startsWith('https://')) {
    try {
      const apiUrl = new URL(apiBase)
      const port = apiUrl.port || (apiUrl.protocol === 'https:' ? '443' : '80')
      const host = `${apiUrl.hostname}${port && port !== '80' && port !== '443' ? `:${port}` : ''}`
      return image.replace(/localhost:4000/g, host)
    } catch {
      return image.replace('localhost:4000', 'localhost:3000')
    }
  }
  const path = image.startsWith('/') ? image : `/${image}`
  if (path.startsWith('/uploads')) {
    return `${apiBase}${path}`
  }
  if (!image.includes('/')) {
    return `${apiBase}/uploads/${image}`
  }
  return image
}

export const getProductLink = (
  product: { slug?: string; name: string; _id: string; category_id?: string },
  categories: { _id: string; slug?: string }[] = []
) => {
  const cat = categories.find((c) => c._id === product.category_id)
  const productSlug = product.slug || generateNameId({ name: product.name, id: product._id })
  return `/${cat?.slug || 'products'}/${productSlug}`
}

export const getCategoryLink = (cat: { slug?: string; name: string; _id: string }, search?: string) => {
  const base = cat.slug ? `/${cat.slug}` : `/products?category=${generateNameId({ name: cat.name, id: cat._id })}`
  if (!search) return base
  const separator = base.includes('?') ? '&' : '?'
  return `${base}${separator}search=${encodeURIComponent(search)}`
}
