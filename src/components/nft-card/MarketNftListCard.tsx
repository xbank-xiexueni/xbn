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

import { ImageWithFallback, SvgComponent } from '@/components'

const MarketNftListCard: FunctionComponent<
  {
    data: Record<string, any>
  } & CardProps
> = ({ data: { node, highestRate }, ...rest }) => {
  const { imageThumbnailUrl, orderPrice, name, backgroundColor } = node || {}
  const [show, setShow] = useState(false)
  const formattedDownPayment = useMemo(() => {
    if (!orderPrice || !highestRate) {
      return '--'
    }

    // const eth = wei2Eth(orderPrice)
    return (Number(orderPrice) * (10000 - Number(highestRate))) / 10000
  }, [orderPrice, highestRate])
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
      h={{
        xl: '355px',
        lg: '320px',
      }}
    >
      <CardBody p={0}>
        <Box bg={backgroundColor || 'white'} borderTopRadius={'lg'}>
          <ImageWithFallback
            src={imageThumbnailUrl}
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

        <Stack
          mt={3}
          spacing={2}
          px={4}
          mb={{
            xl: 2,
            lg: 1,
          }}
        >
          <Text color={`gray.3`} fontSize='sm'>
            {name}
          </Text>
          <Flex justify={'space-between'} alignItems='center'>
            <Text fontSize={'sm'} fontWeight='700' color={'black'}>
              Down Payment
            </Text>
            <Flex
              alignItems={'center'}
              gap={1}
              maxWidth='40%'
              justify={'space-between'}
            >
              <SvgComponent svgId='icon-eth' w={2} />
              <Text
                fontSize={'md'}
                display='inline-block'
                overflow='hidden'
                whiteSpace='nowrap'
                textOverflow='ellipsis'
              >
                &nbsp;{formattedDownPayment}
              </Text>
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
          h={{
            xl: '56px',
            lg: '46px',
          }}
        >
          Buy
        </Button>
      ) : (
        <CardFooter
          px={4}
          justify={'space-between'}
          alignItems='center'
          h={{
            xl: '56px',
            lg: '46px',
          }}
        >
          <Flex alignItems={'center'} gap={1}>
            <Text color={`gray.3`} fontSize='sm'>
              Price
            </Text>
          </Flex>
          <Flex alignItems={'center'} gap={1}>
            <SvgComponent svgId='icon-eth' w={2} />
            <Text fontSize={'sm'} color={`gray.3`}>
              &nbsp; {orderPrice}
              {/* &nbsp; {wei2Eth(orderPrice)} */}
            </Text>
          </Flex>
        </CardFooter>
      )}
    </Card>
  )
}

export default MarketNftListCard
