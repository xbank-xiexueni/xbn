import { Flex, Box, Text, Heading, Skeleton, Highlight } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import isEmpty from 'lodash-es/isEmpty'
import { useRef, useState, type FunctionComponent } from 'react'

import { EmptyComponent, ImageWithFallback, SvgComponent } from '@/components'
import type { NftCollection } from '@/hooks'
import { formatFloat } from '@/utils/format'

const CollectionDescription: FunctionComponent<{
  data?: NftCollection
  loading?: boolean
  highestRate?: number
}> = ({ data, loading, highestRate }) => {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  const offsetHeight = ref.current?.offsetHeight

  if (loading) {
    return (
      <Flex flexDirection={'column'} mb={'48px'}>
        <Flex mb={'16px'} gap={'12px'}>
          <Skeleton h='108px' w='108px' borderRadius={8} />
          <Skeleton
            h='108px'
            w={{
              xl: '760px',
              lg: '520px',
              md: '100%',
              sm: '100%',
              xs: '100%',
            }}
            borderRadius={16}
          />
        </Flex>
        {/* <Skeleton h='100px' borderRadius={16} /> */}
      </Flex>
    )
  }
  if (isEmpty(data)) {
    return <EmptyComponent />
  }
  const {
    name = '',
    description = '',
    imagePreviewUrl = '',
    safelistRequestStatus,
    nftCollectionStat: {
      floorPrice,
      totalSupply,
      totalSales,
      oneDayChange,
      oneDayAveragePrice,
    },
  } = data

  return (
    <Box mb={'48px'}>
      <Flex gap={'20px'} mb={'32px'}>
        <ImageWithFallback
          src={imagePreviewUrl}
          borderRadius={{
            md: 16,
            sm: 8,
            xs: 8,
          }}
          fit='contain'
          bg='gray.100'
          boxSize={{
            md: '108px',
            sm: '48px',
            xs: '48px',
          }}
        />
        <Box pos='relative'>
          <Flex>
            <Heading
              fontSize={{ md: '32px', sm: '20px', xs: '20px' }}
              display='flex'
            >
              {name}
            </Heading>
            {safelistRequestStatus === 'verified' && (
              <SvgComponent svgId='icon-verified-fill' />
            )}
          </Flex>

          <Text
            color='gray.3'
            mt={'4px'}
            fontWeight='medium'
            noOfLines={!show ? 2 : undefined}
            lineHeight='20px'
          >
            {description}
          </Text>
          <Text
            color='transparent'
            mt={'8px'}
            fontWeight='medium'
            lineHeight='20px'
            ref={ref}
            position='absolute'
            left={0}
            right={0}
            top={'36px'}
            zIndex={-1}
          >
            {description}
          </Text>
          {!!offsetHeight && offsetHeight > 40 && (
            <Box
              as='a'
              color='blue.1'
              onClick={() => setShow((prev) => !prev)}
              cursor='pointer'
              fontWeight={700}
              borderRadius='99px'
              _hover={{
                bg: 'gray.5',
              }}
              px={'16px'}
              py={'8px'}
              ml={'-16px'}
              hidden={!description}
            >
              {show ? 'Less' : 'More'}
            </Box>
          )}
        </Box>
      </Flex>

      <Flex
        rowGap={'16px'}
        wrap='wrap'
        justify='flex-start'
        columnGap={{ md: '80px', sm: '60px', xs: '60px' }}
      >
        <Flex flexDir='column' alignItems='center' m={0}>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading
              fontSize={{ md: '24px', sm: '20px', xs: '20px' }}
              fontWeight='700'
              display='flex'
              mb={'4px'}
            >
              {floorPrice || '--'}
            </Heading>
          </Flex>

          <Text
            color='gray.4'
            fontSize={{ md: '14px', sm: '12px', xs: '12px' }}
          >
            Floor price
          </Text>
        </Flex>
        {/* min dp */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading
              fontSize={{ md: '24px', sm: '20px', xs: '20px' }}
              fontWeight='700'
              display='flex'
              mb={'4px'}
            >
              {formatFloat(
                BigNumber(floorPrice)
                  .multipliedBy(BigNumber(10000).minus(Number(highestRate)))
                  .dividedBy(10000)
                  .toNumber(),
              ) || '--'}
            </Heading>
          </Flex>

          <Text
            color='gray.4'
            fontSize={{ md: '14px', sm: '12px', xs: '12px' }}
          >
            Min DP
          </Text>
        </Flex>
        {/* 24h */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading
              fontSize={{ md: '24px', sm: '20px', xs: '20px' }}
              fontWeight='700'
              display='flex'
              mb={'4px'}
            >
              {formatFloat(oneDayAveragePrice) || '--'}
            </Heading>
          </Flex>

          <Text
            color={oneDayChange < 0 ? 'red.1' : 'green.1'}
            fontSize={{ md: '14px', sm: '12px', xs: '12px' }}
          >
            <Highlight
              styles={{
                color: `gray.4`,
              }}
              query='24h'
            >
              {`24h ${BigNumber(oneDayChange).multipliedBy(100).toFixed(2)}%`}
            </Highlight>
          </Text>
        </Flex>
        {/* supply */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <Heading
              fontSize={{ md: '24px', sm: '20px', xs: '20px' }}
              fontWeight='700'
              display='flex'
              mb={'4px'}
            >
              {totalSupply.toLocaleString() || '--'}
            </Heading>
          </Flex>

          <Text
            color='gray.4'
            fontSize={{ md: '14px', sm: '12px', xs: '12px' }}
          >
            Supply
          </Text>
        </Flex>
        {/* listing */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <Heading
              fontSize={{ md: '24px', sm: '20px', xs: '20px' }}
              fontWeight='700'
              display='flex'
              mb={'4px'}
            >
              {totalSales?.toLocaleString() || '--'}
            </Heading>
          </Flex>

          <Text
            color='gray.4'
            fontSize={{ md: '14px', sm: '12px', xs: '12px' }}
          >
            Listing
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}
export default CollectionDescription
