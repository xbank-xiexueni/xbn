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
  const { imageThumbnailUrl, orderPrice, name, backgroundColor, tokenID } =
    node || {}
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
      w='100%'
      h={{
        xl: '100%',
        lg: '320px',
      }}
    >
      <CardBody p={0}>
        <Box
          bg={backgroundColor || 'white'}
          borderTopRadius={'lg'}
          overflow='hidden'
        >
          <ImageWithFallback
            src={imageThumbnailUrl}
            alt='Green double couch with wooden legs'
            borderTopRadius={'lg'}
            h={{
              xl: '100%',
              lg: '200px',
              md: '160px',
              sm: '50%',
            }}
            w='100%'
            fit='contain'
            transform={`scale(${show ? 1.2 : 1})`}
            transition='all 0.6s'
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
          <Text color={`gray.3`} fontSize='sm' noOfLines={1}>
            {name || `#${tokenID}`}
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

      <Button
        borderRadius={8}
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
        variant='other'
        h={
          show
            ? {
                xl: '48px',
                lg: '40px',
              }
            : 0
        }
        position='absolute'
        bottom={0}
        right={0}
        left={0}
        transition='all 0.15s'
      >
        {show && 'Buy'}
      </Button>
      <CardFooter
        px={4}
        justify={'space-between'}
        alignItems='center'
        h={{
          xl: '48px',
          lg: '40px',
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
    </Card>
  )
}

export default MarketNftListCard
