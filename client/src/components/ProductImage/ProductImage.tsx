import { useState } from 'react'
import { getFallbackImageForName, isBrokenImageUrl, resolveImageUrl } from '../../utils/utils'

type ProductImageProps = {
  src?: string
  alt: string
  className?: string
  productName?: string
  images?: string[]
}

export default function ProductImage({ src, alt, className, productName = '', images = [] }: ProductImageProps) {
  const candidates = [src, ...images].filter((url) => url && !isBrokenImageUrl(url)) as string[]
  const [index, setIndex] = useState(0)

  const currentSrc =
    index < candidates.length
      ? resolveImageUrl(candidates[index], productName)
      : getFallbackImageForName(productName)

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading='lazy'
      onError={() => setIndex((prev) => prev + 1)}
    />
  )
}
