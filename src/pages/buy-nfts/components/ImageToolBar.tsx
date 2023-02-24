import { Flex, Text } from '@chakra-ui/react'
import numeral from 'numeral'
import { PhotoView } from 'react-photo-view'

import type { AssetListItemType } from '@/api'
import { SvgComponent } from '@/components'
import downloadRemoteImg from '@/utils/downloadRemoteImg'

import type { FunctionComponent } from 'react'

type ImageToolBarProps = {
  data: AssetListItemType
}
const ImageToolBar: FunctionComponent<ImageToolBarProps> = ({
  data: { image_original_url, likes },
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
        <SvgComponent svgId='like' />
        <Text fontWeight={'700'} color='black.1'>
          {numeral(likes).format('0.00a')}
        </Text>
      </Flex>
      <Flex gap={2}>
        <Flex
          w={10}
          h={10}
          bg='gray.5'
          borderRadius={'40px'}
          alignItems='center'
          justify={'center'}
          onClick={() => {
            downloadRemoteImg(image_original_url, 'xx')
          }}
        >
          <SvgComponent svgId='icon-download' />
        </Flex>
        <PhotoView src={image_original_url}>
          <Flex
            w={10}
            h={10}
            bg='gray.5'
            borderRadius={'40px'}
            alignItems='center'
            justify={'center'}
          >
            <SvgComponent svgId='icon-expand' />
          </Flex>
        </PhotoView>
      </Flex>
    </Flex>
  )
}

export default ImageToolBar
