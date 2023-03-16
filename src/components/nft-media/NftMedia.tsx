import { Flex, type FlexProps, chakra } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'
import { Player } from 'video-react'

import { type AssetListItemType } from '@/api'
import { ImageWithFallback } from '@/components'
import { judgeNftMediaType, NFT_MEDIA_TYPE } from '@/utils/judgeNftMediaType'

type NftMediaProps = {
  data: AssetListItemType
} & FlexProps

const NftMedia: FunctionComponent<NftMediaProps> = ({
  data: { animation_url, image_preview_url },
  bg,
  alignItems,
  ...rest
}) => {
  const MEDIA_TYPE = judgeNftMediaType(animation_url)
  switch (MEDIA_TYPE) {
    case NFT_MEDIA_TYPE.HTML_MEDIA:
      return (
        <Flex bg={bg || 'gray.2'} alignItems={alignItems || 'center'} {...rest}>
          <chakra.iframe
            src={animation_url}
            referrerPolicy='no-referrer'
            // allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            // sandbox='allow-scripts'
            {...rest}
          />
        </Flex>
      )
    case NFT_MEDIA_TYPE.VIDEO_MEDIA:
      return (
        <Flex bg={bg || 'gray.2'} alignItems={alignItems || 'center'} {...rest}>
          <Player autoPlay={false}>
            <source src={animation_url} />
          </Player>
        </Flex>
      )

    default:
      return <ImageWithFallback src={image_preview_url} {...rest} />
  }
}

export default NftMedia
