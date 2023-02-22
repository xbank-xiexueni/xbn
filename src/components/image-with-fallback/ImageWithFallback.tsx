import { Image, type ImageProps } from '@chakra-ui/react'

import defaultImg from '@/assets/default.png'

import type { FunctionComponent } from 'react'

const ImageWithFallback: FunctionComponent<ImageProps> = ({
  fallbackSrc,
  ...rest
}) => {
  return <Image fallbackSrc={fallbackSrc || defaultImg} {...rest} />
}

export default ImageWithFallback
