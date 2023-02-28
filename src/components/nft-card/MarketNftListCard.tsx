import {
  Box,
  Card,
  CardBody,
  type CardProps,
  Divider,
  Flex,
  Stack,
  Text,
  Button,
  CardFooter,
} from '@chakra-ui/react'
import { useMemo, useState, type FunctionComponent } from 'react'

import type { AssetListItemType } from '@/api'
import { ImageWithFallback, SvgComponent } from '@/components'
import { wei2Eth } from '@/utils/unit-conversion'

const MarketNftListCard: FunctionComponent<
  {
    data: AssetListItemType & Record<string, string | number | undefined>
  } & CardProps
> = ({
  data: { name, image_thumbnail_url, highestRate, order_price },
  ...rest
}) => {
  const [show, setShow] = useState(false)
  const formattedDownPayment = useMemo(() => {
    if (!order_price || !highestRate) {
      return '--'
    }

    const eth = wei2Eth(order_price)
    return (Number(eth) * (10000 - Number(highestRate))) / 10000
  }, [order_price, highestRate])
  return (
    <Card
      {...rest}
      _hover={{
        boxShadow: `var(--chakra-colors-gray-1) 0px 0px 10px`,
      }}
      cursor='pointer'
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      borderRadius={8}
      border='none'
    >
      <CardBody p={0}>
        <Box bg='white'>
          <ImageWithFallback
            src={image_thumbnail_url}
            alt='Green double couch with wooden legs'
            borderTopRadius={'lg'}
            h={{
              xl: '230px',
              lg: '200px',
              md: '160px',
              sm: '50%',
            }}
            w='100%'
            fit='contain'
          />
        </Box>

        <Stack mt={3} spacing={2} px={4} mb={2}>
          <Text color={`gray.3`} fontSize='sm'>
            {name}
          </Text>
          <Flex justify={'space-between'} alignItems='center'>
            <Text fontSize={'sm'} fontWeight='700' color={'black'}>
              Down Payment
            </Text>
            <Flex alignItems={'center'} gap={1}>
              <SvgComponent svgId='icon-eth' w={2} />
              <Text fontSize={'md'}>&nbsp;{formattedDownPayment}</Text>
            </Flex>
          </Flex>
        </Stack>
      </CardBody>
      <Divider color={`gray.2`} />
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
            <Text color={`gray.3`} fontSize='sm'>
              Price
            </Text>
          </Flex>
          <Flex alignItems={'center'} gap={1}>
            <SvgComponent svgId='icon-eth' w={2} />
            <Text fontSize={'sm'} color={`gray.3`}>
              &nbsp; {wei2Eth(order_price)}
            </Text>
          </Flex>
        </CardFooter>
      )}
    </Card>
  )
}

export default MarketNftListCard
