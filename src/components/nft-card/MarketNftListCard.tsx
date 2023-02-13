import {
  Box,
  Card,
  CardBody,
  CardFooter,
  type CardProps,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react'

import { NftOrigin, SvgComponent } from '@/components'
import COLORS from '@/utils/Colors'

import type { FunctionComponent } from 'react'

const MarketNftListCard: FunctionComponent<
  {
    // temp
    data: any
  } & CardProps
> = ({ data, ...rest }) => {
  const [show, setShow] = useState(false)
  return (
    <Card
      {...rest}
      _hover={{
        boxShadow: `${COLORS.tipTextColor} 0px 0px 10px`,
      }}
      cursor='pointer'
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      borderRadius={8}
    >
      <CardBody p={0}>
        <Box bg='gray.100'>
          <Image
            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
            alt='Green double couch with wooden legs'
            borderTopRadius={'lg'}
            h='233px'
            fit='contain'
          />
        </Box>

        <Stack mt={3} spacing={2} px={4} mb={2}>
          <Text color={COLORS.secondaryTextColor} fontSize='sm'>
            Azuki #6671
          </Text>
          <Flex justify={'space-between'} alignItems='center'>
            <Text fontSize={'sm'}>aaaa</Text>
            <Flex alignItems={'center'} gap={1}>
              <SvgComponent svgId='icon-eth' w={2} />
              <Text fontSize={'md'}>11.22</Text>
            </Flex>
          </Flex>
        </Stack>
      </CardBody>
      <Divider color={COLORS.borderColor} px={4} />
      {show ? (
        <Button
          borderRadius={8}
          borderTopLeftRadius={0}
          borderTopRightRadius={0}
          variant='other'
          h='56px'
        >
          Buy
        </Button>
      ) : (
        <CardFooter
          p={4}
          justify={'space-between'}
          alignItems='center'
          h='56px'
        >
          <Flex alignItems={'center'} gap={1}>
            <NftOrigin type={1} />
          </Flex>
          <Flex alignItems={'center'} gap={1}>
            <SvgComponent svgId='icon-eth' w={2} />
            <Text fontSize={'sm'} color={COLORS.secondaryTextColor}>
              11.22
            </Text>
          </Flex>
        </CardFooter>
      )}
    </Card>
  )
}

export default MarketNftListCard
