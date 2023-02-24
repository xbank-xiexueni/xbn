import { Box, type BoxProps, Heading, Flex, Text } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

import type { CollectionListItemType } from '@/api'
import { ImageWithFallback, SvgComponent } from '@/components'
import { UNIT } from '@/constants'
import wei2Eth from '@/utils/wei2Eth'

const BelongToCollection: FunctionComponent<
  BoxProps & {
    data: CollectionListItemType & Record<string, string | number>
  }
> = ({
  data: { name = '', image_url = '', safelist_request_status, lowestPrice },
  ...rest
}) => {
  return (
    <Box
      {...rest}
      mt='60px'
      w={{
        xl: '600px',
        lg: '380px',
        sm: '100%',
      }}
    >
      <Heading size={'lg'} mb={4}>
        Collection
      </Heading>
      <Flex alignItems={'center'} p={4} borderRadius={16} bg='gray.5' gap={4}>
        <ImageWithFallback src={image_url} w='72px' h='72px' borderRadius={8} />
        <Box>
          <Flex>
            <Text fontSize={'18px'} fontWeight='bold'>
              {name}
            </Text>
            {safelist_request_status === 'verified' && (
              <SvgComponent svgId='icon-verified-fill' />
            )}
          </Flex>

          <Text fontSize={'18px'} fontWeight='bold'>
            {wei2Eth(lowestPrice)}
            &nbsp;
            {UNIT}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default BelongToCollection
