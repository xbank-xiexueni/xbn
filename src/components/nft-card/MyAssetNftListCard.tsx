import {
  Box,
  Card,
  CardBody,
  CardFooter,
  type CardProps,
  Flex,
  Text,
  Button,
  type ImageProps,
  type TextProps,
} from '@chakra-ui/react'
import { useMemo, useState, type FunctionComponent } from 'react'

import { useIsMobile, type AssetWithoutIdQuery } from '@/hooks'

import { ImageWithFallback } from '..'

const MortgagedTag: FunctionComponent<TextProps> = ({ ...rest }) => (
  <Text
    borderColor='red.1'
    boxShadow={`inset 0 0 0px 1px var(--chakra-colors-red-1)`}
    p={{
      lg: '8px',
      md: '4px',
      sm: '4px',
      xs: '4px',
    }}
    borderRadius={{
      md: 8,
      sm: 2,
      xs: 2,
    }}
    noOfLines={1}
    fontSize={'12px'}
    fontWeight='700'
    color='red.1'
    lineHeight={{
      md: '16px',
      sm: '12px',
      xs: '12px',
    }}
    transform={{
      md: 'none',
      sm: `scale(0.6666)`,
      xs: `scale(0.6666)`,
    }}
    transformOrigin='center'
    {...rest}
  >
    Mortgaged
  </Text>
)

const ListingTag = () => {
  return (
    <Text
      pos='absolute'
      zIndex={10}
      left={{
        md: '16px',
        sm: '0',
        xs: '0',
      }}
      right={{
        md: '16px',
        sm: '0',
        xs: '0',
      }}
      bottom={{
        md: '12px',
        sm: '8px',
        xs: '4px',
      }}
      py='12px'
      bg='rgba(86, 110, 140, 0.33)'
      backdropFilter={'blur(6px)'}
      borderRadius={8}
      fontWeight='700'
      color='white'
      textAlign={'center'}
      lineHeight={{
        md: '16px',
        sm: '12px',
        xs: '12px',
      }}
      transform={{
        md: 'none',
        sm: `scale(0.8333)`,
        xs: `scale(0.8333)`,
      }}
      transformOrigin='center'
      fontSize={{
        md: '14px',
        sm: '12px',
        xs: '12px',
      }}
    >
      Listing
    </Text>
  )
}
const MyAssetNftListCard: FunctionComponent<
  {
    contractInfo: MyAssetListItemType
    assetInfo?: AssetWithoutIdQuery['asset']
    imageSize: ImageProps['boxSize']
    onListForSale?: () => void
    onChangeList?: () => void
    onCancelList?: () => void
  } & CardProps
> = ({
  contractInfo,
  assetInfo,
  imageSize,
  onListForSale,
  onCancelList,
  onChangeList,
  ...rest
}) => {
  const ish5 = useIsMobile()
  const [show, setShow] = useState(ish5)

  /**
   * 1339 : 没有挂单 & 没有质押
   * 0 : 没有挂单 & 质押中
   * 10 : 挂单 & 没有质押
   * 3690 : 挂单 & 质押中
   */
  const isMortgaged = useMemo(
    () => contractInfo?.loan_status === 0,
    [contractInfo],
  )
  // const isMortgaged = useMemo(
  //   () =>
  //     contractInfo?.token_id === '0' ||
  //     contractInfo.token_id === '3690' ||
  //     contractInfo.token_id.length > 20,
  //   [contractInfo],
  // )
  const isListing = useMemo(
    () => contractInfo?.token_id === '10',
    [contractInfo],
  )

  const title = useMemo(() => {
    const unFormatName = assetInfo?.name || `#${contractInfo.token_id}`
    if (ish5) {
      const isLonger = unFormatName?.length > 20
      return isLonger ? `${unFormatName.substring(0, 20)}...` : unFormatName
    }
    return `${unFormatName}`
  }, [contractInfo, assetInfo, ish5])

  return (
    <Card
      _hover={{
        boxShadow: `var(--chakra-colors-gray-2) 0px 0px 3px`,
      }}
      cursor='pointer'
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(ish5 ? true : false)}
      borderRadius={16}
      w='100%'
      h={'100%'}
      boxShadow='none'
      borderColor={'gray.2'}
      borderWidth='1px'
      {...rest}
    >
      <CardBody p={0} border='none'>
        <Box
          bg={'white'}
          borderTopRadius={16}
          overflow='hidden'
          pos={'relative'}
          w='100%'
        >
          <ImageWithFallback
            src={assetInfo?.imagePreviewUrl}
            borderRadius={0}
            alt={assetInfo?.name}
            boxSize={imageSize}
            fit='contain'
            transition='all 0.6s'
            _hover={{
              transform: `scale(1.2)`,
            }}
          />
          {isListing && <ListingTag />}
        </Box>

        <Flex
          h={'68px'}
          justify='space-between'
          px='16px'
          alignItems={'center'}
          flexWrap={{
            md: 'nowrap',
            sm: 'wrap',
            xs: 'wrap',
          }}
          pos={'relative'}
        >
          <Text
            fontSize={{
              lg: '18px',
              md: '16px',
              sm: '16px',
              xs: '16px',
            }}
            fontWeight={'bold'}
            w={
              !isMortgaged
                ? '100%'
                : { xl: '70%', lg: '55%', md: '40%', sm: '100%', xs: '100%' }
            }
            noOfLines={2}
            lineHeight={'22px'}
          >
            {title}
          </Text>

          {isMortgaged && (
            <MortgagedTag
              pos={{
                md: 'static',
                sm: 'absolute',
                xs: 'absolute',
              }}
              right={0}
              bottom={'6px'}
            />
          )}
        </Flex>
      </CardBody>

      {isListing ? (
        <Flex
          position='absolute'
          bottom={0}
          right={0}
          left={0}
          transition='all 0.15s'
          h={
            show
              ? {
                  lg: '56px',
                  md: '48px',
                  sm: '36px',
                  xs: '36px',
                }
              : 0
          }
        >
          {['Change', 'Cancel'].map((item, index) => (
            <Button
              hidden={!show}
              borderRadius={0}
              borderBottomLeftRadius={index === 0 ? 16 : 0}
              borderBottomRightRadius={index === 1 ? 16 : 0}
              key={item}
              fontSize={{
                md: '16px',
                sm: '12px',
                xs: '12px',
              }}
              variant={'unstyled'}
              w='50%'
              color={'blue.1'}
              bg={'gray.5'}
              _hover={{
                color: 'white',
                bg: 'blue.1',
              }}
              h='100%'
              onClick={() => {
                if (item === 'Change' && onChangeList) {
                  onChangeList()
                  return
                }
                if (item === 'Cancel' && onCancelList) {
                  onCancelList()
                  return
                }
              }}
            >
              {item}
            </Button>
          ))}
        </Flex>
      ) : (
        <Button
          borderRadius={16}
          borderTopLeftRadius={0}
          borderTopRightRadius={0}
          bg='blue.1'
          color='white'
          _hover={{
            opacity: 1,
            bg: 'blue.1',
            color: 'white',
          }}
          h={
            show
              ? {
                  lg: '56px',
                  md: '48px',
                  sm: '36px',
                  xs: '36px',
                }
              : '0'
          }
          position='absolute'
          bottom={0}
          right={0}
          left={0}
          transition='all 0.15s'
          onClick={onListForSale}
        >
          {show && 'List for sale'}
        </Button>
      )}

      <CardFooter
        h={{
          lg: '56px',
          md: '48px',
          sm: '36px',
          xs: '36px',
        }}
        justify={'center'}
        alignItems='center'
        borderBottomRadius={16}
      />
    </Card>
  )
}

export default MyAssetNftListCard
