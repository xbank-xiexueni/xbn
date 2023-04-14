import { Image, type ImageProps } from '@chakra-ui/react'

import defaultImg from '@/assets/default.png'

import type { FunctionComponent } from 'react'

const ImageWithFallback: FunctionComponent<ImageProps> = ({
  fallbackSrc = defaultImg,
  alt,
  src,
  ...rest
}) => {
  return (
    <Image
      alt={alt || 'image'}
      src={src}
      {...rest}
      fallback={
        <Image
          src={fallbackSrc || defaultImg}
          alt={alt || 'fallback'}
          {...rest}
        />
      }
    />
  )
}

export default ImageWithFallback
