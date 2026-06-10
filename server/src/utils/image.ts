const API_HOST = process.env.API_HOST || `http://localhost:${process.env.PORT || 3000}`

/** Unsplash photo IDs that currently return 404 */
const BROKEN_UNSPLASH_IDS = new Set([
  'photo-1598327105666-5b89351cb31b',
  'photo-1563914945464-946766d6a2f7',
  'photo-1527814050087-379381547961'
])

const FALLBACK_BY_KEYWORD: { keywords: string[]; url: string }[] = [
  {
    keywords: ['galaxy', 'iphone', 'phone', 'smartphone', 'ipad', 'tablet'],
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600'
  },
  {
    keywords: ['laptop', 'macbook', 'notebook', 'xps', 'legion', 'strix'],
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600'
  },
  {
    keywords: ['rtx', 'gtx', 'gpu', 'graphic', 'card màn hình', 'geforce'],
    url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=600'
  },
  {
    keywords: ['cpu', 'intel', 'ryzen', 'processor', 'mainboard', 'motherboard'],
    url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600'
  },
  {
    keywords: ['ssd', 'hdd', 'hard drive', 'nvme'],
    url: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&q=80&w=600'
  },
  {
    keywords: ['ram', 'memory'],
    url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=600'
  },
  {
    keywords: ['keyboard', 'mouse', 'headset', 'speaker', 'phụ kiện'],
    url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600'
  }
]

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600'

export const isBrokenImageUrl = (url?: string): boolean => {
  if (!url) return true
  for (const id of BROKEN_UNSPLASH_IDS) {
    if (url.includes(id)) return true
  }
  return false
}

export const getFallbackImageForName = (name = ''): string => {
  const lower = name.toLowerCase()
  for (const item of FALLBACK_BY_KEYWORD) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.url
    }
  }
  return DEFAULT_FALLBACK
}

export const normalizeImageUrl = (image?: string): string => {
  if (!image) return ''
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image.replace('localhost:4000', `localhost:${process.env.PORT || 3000}`)
  }
  const path = image.startsWith('/') ? image : `/${image}`
  if (path.startsWith('/uploads') || path.startsWith('/uploads')) {
    return `${API_HOST}${path}`
  }
  if (!image.includes('/') && !image.startsWith('http')) {
    return `${API_HOST}/uploads/${image}`
  }
  return image
}

export const resolveProductImage = (product: {
  name?: string
  image?: string
  images?: string[]
}): string => {
  const candidates = [product.image, ...(product.images || [])].filter(Boolean) as string[]

  for (const raw of candidates) {
    if (isBrokenImageUrl(raw)) continue
    const normalized = normalizeImageUrl(raw)
    if (normalized) return normalized
  }

  return getFallbackImageForName(product.name || '')
}

export const normalizeProductImages = <
  T extends { name?: string; image?: string; images?: string[] }
>(
  product: T
): T => {
  const resolved = resolveProductImage(product)
  return {
    ...product,
    image: resolved,
    images: product.images?.length ? product.images.map((img) => resolveProductImage({ name: product.name, image: img })) : [resolved]
  }
}
