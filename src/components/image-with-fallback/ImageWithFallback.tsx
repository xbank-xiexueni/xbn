import { Image, type ImageProps } from '@chakra-ui/react'

import defaultImg from '@/assets/default.png'

import type { FunctionComponent } from 'react'

const ImageWithFallback: FunctionComponent<ImageProps> = ({
  fallbackSrc = defaultImg,
  h,
  w,
  height,
  width,
  borderRadius,
  alt,
  ...rest
}) => {
  return (
    <Image
      h={h}
      w={w}
      height={height}
      width={width}
      borderRadius={borderRadius}
      alt={alt || 'image'}
      {...rest}
      fallback={
        <Image
          src={fallbackSrc || defaultImg}
          h={h}
          w={w}
          height={height}
          width={width}
          borderRadius={borderRadius}
          alt={alt || 'fallback'}
        />
      }
    />
  )
}

export default ImageWithFallback
