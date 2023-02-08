import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  type BoxProps,
} from '@chakra-ui/react'

import COLORS from '@/utils/Colors'

import IconEth from '@/assets/icon/icon-eth.svg'
import IconLooksRare from '@/assets/icon/icon-loosrare.svg'
import IconVerified from '@/assets/icon/icon-verified-fill.svg'

import type { FunctionComponent } from 'react'

const DetailComponent: FunctionComponent<
  BoxProps & {
    data: {
      name1: string
      name2: string
      price: string
      verified: boolean
    }
  }
> = ({ data: { name1, name2, price, verified } }) => {
  return (
    <Box mt={8}>
      {/* 名称*/}
      <Flex>
        <Text fontWeight={'500'}>{name1}</Text>
        {verified && <Image src={IconVerified} />}
      </Flex>
      <Heading fontSize={'40px'}>{name2}</Heading>
      {/* 价格 */}
      <Flex
        bg={COLORS.secondaryBgc}
        alignItems='end'
        borderRadius={16}
        p={5}
        justify='space-between'
        mt={6}
      >
        <Box>
          <Text>Price</Text>
          <Flex alignItems={'baseline'} mt={1} gap={1}>
            <Image src={IconEth} h={'28px'} />
            <Heading size={'xl'}>{price}</Heading>
            <Text fontSize={'xs'}>$123123</Text>
          </Flex>
        </Box>
        <Flex gap={1}>
          <Image src={IconLooksRare} />
          <Text fontSize={'14px'} fontWeight={500}>
            LooksRare
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default DetailComponent
