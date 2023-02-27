import {
  Box,
  Flex,
  Heading,
  Skeleton,
  Text,
  type BoxProps,
} from '@chakra-ui/react'

import { SvgComponent } from '@/components'

import type { FunctionComponent } from 'react'

const DetailComponent: FunctionComponent<
  BoxProps & {
    data: {
      name1: string
      name2: string
      price: string
      verified: boolean
      usdPrice?: string
    }
    loading?: boolean
  }
> = ({ data: { name1, name2, price, verified, usdPrice }, loading }) => {
  if (loading) {
    return <Skeleton h={200} borderRadius={16} />
  }
  return (
    <Box mt={8}>
      {/* 名称*/}
      <Flex alignItems={'baseline'}>
        <Text fontWeight={'500'}>{name1}</Text>
        {verified && <SvgComponent svgId='icon-verified-fill' />}
      </Flex>
      <Heading fontSize={'40px'}>{name2}</Heading>
      {/* 价格 */}
      <Flex
        bg='gray.5'
        alignItems='end'
        borderRadius={16}
        p={5}
        justify='space-between'
        mt={6}
      >
        <Box>
          <Text>Price</Text>
          <Flex alignItems={'end'} mt={1}>
            <SvgComponent svgId='icon-eth' svgSize='32px' />
            <Heading fontSize={'32px'} lineHeight='36px'>
              {price}
            </Heading>
            {!!usdPrice && <Text fontSize={'xs'}>&nbsp;$ {usdPrice}</Text>}
          </Flex>
        </Box>
        {/* <NftOrigin type={1} /> */}
      </Flex>
    </Box>
  )
}

export default DetailComponent
