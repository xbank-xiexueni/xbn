import { Image, type ImageProps } from '@chakra-ui/react'

import defaultImg from '@/assets/default.png'

import type { FunctionComponent } from 'react'

const ImageWithFallback: FunctionComponent<ImageProps> = ({
  fallbackSrc = defaultImg,
  alt,
  ...rest
}) => {
  return (
    <Image
      alt={alt || 'image'}
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
