import { chakra, Flex, type FlexProps, type ImageProps } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'
import {
  BigPlayButton,
  ControlBar,
  PlaybackRateMenuButton,
  Player,
} from 'video-react'

import { ImageWithFallback } from '@/components'
import { judgeNftMediaType, NFT_MEDIA_TYPE } from '@/utils/judgeNftMediaType'

type NftMediaProps = {
  data: {
    animationUrl?: string
    imagePreviewUrl?: string
  }
} & FlexProps &
  ImageProps

const BLUR_BEFORE_STYLE = {
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  filter: 'blur(100px)',
  top: 0,
  left: 0,
  width: '100%',
  height: '110%',
  content: '""',
  position: 'absolute',
}
const NftMedia: FunctionComponent<NftMediaProps> = ({
  data: { animationUrl, imagePreviewUrl },
  alignItems,
  ...rest
}) => {
  if (!animationUrl) {
    return (
      <Flex
        position={'relative'}
        _before={{
          background: `url(${imagePreviewUrl})`,
          ...BLUR_BEFORE_STYLE,
        }}
        overflow='hidden'
        borderWidth={1}
        borderColor='gray.2'
        {...rest}
      >
        <ImageWithFallback src={imagePreviewUrl} zIndex={1} {...rest} />
      </Flex>
    )
  }
  const MEDIA_TYPE = judgeNftMediaType(animationUrl)
  switch (MEDIA_TYPE) {
    case NFT_MEDIA_TYPE.HTML_MEDIA:
      return (
        <Flex
          bg={'gray.2'}
          alignItems={alignItems || 'center'}
          borderWidth={1}
          borderColor='gray.2'
          {...rest}
        >
          <chakra.iframe
            src={animationUrl}
            referrerPolicy='no-referrer'
            // allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            // sandbox='allow-scripts'
            {...rest}
          />
        </Flex>
      )
    case NFT_MEDIA_TYPE.VIDEO_MEDIA:
      return (
        <Flex
          bg={'gray.2'}
          alignItems={alignItems || 'center'}
          position={'relative'}
          _before={{
            background: `url(${imagePreviewUrl})`,
            ...BLUR_BEFORE_STYLE,
          }}
          borderWidth={1}
          borderColor='gray.2'
          overflow='hidden'
          {...rest}
        >
          <Player autoPlay={false} poster={imagePreviewUrl}>
            <source src={animationUrl} />
            <BigPlayButton position='center' />
            <ControlBar>
              <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
            </ControlBar>
          </Player>
        </Flex>
      )

    default:
      return (
        <Flex
          _before={{
            background: `url(${imagePreviewUrl})`,
            ...BLUR_BEFORE_STYLE,
          }}
          borderWidth={1}
          borderColor='gray.2'
          overflow='hidden'
          {...rest}
        >
          <ImageWithFallback src={imagePreviewUrl} {...rest} />
        </Flex>
      )
  }
}

export default NftMedia
