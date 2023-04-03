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
  type ImageProps,
} from '@chakra-ui/react'
import { useMemo, useState, type FunctionComponent } from 'react'

import { ImageWithFallback, SvgComponent } from '@/components'

const MarketNftListCard: FunctionComponent<
  {
    data: Record<string, any>
    imageSize?: ImageProps['w']
  } & CardProps
> = ({ data: { node, highestRate }, imageSize, ...rest }) => {
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
        boxShadow: `var(--chakra-colors-gray-2) 0px 0px 3px`,
      }}
      cursor='pointer'
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      borderRadius={8}
      w='100%'
      h={'100%'}
      boxShadow='none'
      borderColor={'gray.2'}
      borderWidth='1px'
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
            h={
              imageSize || {
                xl: '233px',
                lg: '100%',
                md: '100%',
                sm: '50%',
                xs: '50%',
              }
            }
            w='100%'
            fit='contain'
            transform={`scale(${show ? 1.2 : 1})`}
            transition='all 0.6s'
          />
        </Box>

        <Stack
          mt={'12px'}
          spacing={'8px'}
          px={{
            md: '16px',
            sm: '12px',
            xs: '12px',
          }}
          mb={{
            xl: '8px',
            lg: '4px',
            md: '4px',
          }}
        >
          <Text color={`gray.3`} fontSize='14px' noOfLines={1}>
            {name || `#${tokenID}`}
          </Text>
          <Flex alignItems={'center'} justify='space-between'>
            <Flex
              w={{
                md: '100%',
                sm: '70%',
                xs: '70%',
              }}
              justify={{
                md: 'space-between',
                sm: 'flex-start',
                xs: 'flex-start',
              }}
              alignItems={{
                md: 'center',
                sm: 'flex-start',
                xs: 'flex-start',
              }}
              flexDir={{ md: 'row', sm: 'column', xs: 'column' }}
              pb={{
                md: '8px',
                sm: '6px',
                xs: '6px',
              }}
            >
              <Text
                fontSize={{
                  md: '14px',
                  xs: '12px',
                  sm: '12px',
                }}
                transform={{
                  md: 'none',
                  sm: 'scale(0.83333)',
                  xs: 'scale(0.83333)',
                }}
                transformOrigin='center'
                fontWeight='700'
                color={'black'}
                ml={{
                  md: 0,
                  sm: '-4px',
                  xs: '-4px',
                }}
              >
                Down Payment
              </Text>
              <Flex
                alignItems={'baseline'}
                gap={'4px'}
                maxWidth={{ md: '40%', sm: '100%', xs: '100%' }}
                justify={'space-between'}
              >
                <SvgComponent svgId='icon-eth' w={'4px'} svgSize='14px' />
                <Text
                  fontSize={'16px'}
                  display='inline-block'
                  overflow='hidden'
                  whiteSpace='nowrap'
                  textOverflow='ellipsis'
                >
                  &nbsp;{formattedDownPayment}
                </Text>
              </Flex>
            </Flex>
            <Text
              display={{
                md: 'none',
                xs: 'block',
                sm: 'block',
              }}
              color='blue.3'
              fontWeight={'700'}
            >
              BUY
            </Text>
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
                md: '40px',
                sm: '40px',
                xs: '40px',
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
        px={{ md: '16px', sm: '12px', xs: '12px' }}
        justify={'space-between'}
        alignItems='center'
        h={{
          xl: '48px',
          lg: '40px',
          md: '40px',
          sm: '40px',
          xs: '40px',
        }}
        flexDir={{
          md: 'row',
          sm: 'row-reverse',
          xs: 'row-reverse',
        }}
      >
        <Flex alignItems={'center'} gap={'4px'}>
          <Text color={`gray.3`} fontSize='14px'>
            Price
          </Text>
        </Flex>
        <Flex alignItems={'center'} gap={'4px'}>
          <SvgComponent svgId='icon-eth' w={'4px'} svgSize='14px' />
          <Text fontSize={'14px'} color={`gray.3`}>
            &nbsp; {orderPrice}
            {/* &nbsp; {wei2Eth(orderPrice)} */}
          </Text>
        </Flex>
      </CardFooter>
    </Card>
  )
}

export default MarketNftListCard
