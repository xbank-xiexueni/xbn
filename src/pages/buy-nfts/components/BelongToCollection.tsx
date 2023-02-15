import {
  Box,
  type BoxProps,
  Heading,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

import { SvgComponent } from '@/components'
import { UNIT } from '@/constants'

const BelongToCollection: FunctionComponent<
  BoxProps & {
    data: {
      name: string
      img: string
      price: string
      verified: boolean
    }
  }
> = ({
  data: { name = '', img = '', price = '', verified = false },
  ...rest
}) => {
  return (
    <Box {...rest} mt='60px'>
      <Heading size={'lg'} mb={4}>
        Collection
      </Heading>
      <Flex alignItems={'center'} p={4} borderRadius={16} bg='gray.5' gap={4}>
        <Image src={img} w='72px' h='72px' />
        <Box>
          <Flex>
            <Text fontSize={'18px'} fontWeight='bold'>
              {name}
            </Text>
            {verified && <SvgComponent svgId='icon-verified-fill' />}
          </Flex>

          <Text fontSize={'18px'} fontWeight='bold'>
            {price}
            {UNIT}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default BelongToCollection
