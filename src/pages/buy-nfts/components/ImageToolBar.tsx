import { Flex, IconButton, Text } from '@chakra-ui/react'
import numeral from 'numeral'
import { PhotoView } from 'react-photo-view'

import type { AssetListItemType } from '@/api'
import { SvgComponent } from '@/components'
import downloadRemoteImg from '@/utils/downloadRemoteImg'
import { judgeNftMediaType, NFT_MEDIA_TYPE } from '@/utils/judgeNftMediaType'

import type { FunctionComponent } from 'react'

type ImageToolBarProps = {
  data: AssetListItemType
}
const ImageToolBar: FunctionComponent<ImageToolBarProps> = ({
  data: { image_original_url, likes, name, image_url, animation_url },
}) => {
  return (
    <Flex
      h='40px'
      mt={6}
      alignItems='center'
      justify={'space-between'}
      w={{
        xl: '600px',
        lg: '380px',
        sm: '100%',
      }}
    >
      <Flex alignItems={'center'} gap={1}>
        <SvgComponent svgId='icon-like' />
        <Text fontWeight={'700'} color='black.1'>
          {numeral(likes).format('0.00 a')}
        </Text>
      </Flex>
      {judgeNftMediaType(animation_url) === NFT_MEDIA_TYPE.IMAGE_MEDIA && (
        <Flex gap={2}>
          <IconButton
            icon={<SvgComponent svgId='icon-download' />}
            aria-label='download'
            alignItems={'center'}
            bg='gray.5'
            onClick={() => {
              try {
                downloadRemoteImg(image_original_url, name, image_url)
              } catch (error) {
                console.log(error)
              }
            }}
          />
          <PhotoView src={image_original_url}>
            <IconButton
              icon={<SvgComponent svgId='icon-expand' />}
              aria-label='download'
              alignItems={'center'}
              bg='gray.5'
            />
          </PhotoView>
        </Flex>
      )}
    </Flex>
  )
}

export default ImageToolBar
