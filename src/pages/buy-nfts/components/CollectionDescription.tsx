import {
  Flex,
  Box,
  Text,
  Heading,
  Skeleton,
  HStack,
  Highlight,
} from '@chakra-ui/react'
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
  const current = ref.current

  if (loading) {
    return (
      <Flex flexDirection={'column'} mb={12}>
        <Flex mb={4} gap={3}>
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
    <Box mb={12}>
      <Flex gap={5} mb={8}>
        <ImageWithFallback
          src={imagePreviewUrl}
          borderRadius={16}
          fit='contain'
          w='108px'
          h='108px'
          bg='gray.100'
        />
        <Box pos='relative'>
          <Flex>
            <Heading
              fontSize={{ lg: '3xl', md: 'xl', sm: 'xl', xs: 'xl' }}
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
            mt={2}
            fontSize={'md'}
            fontWeight='medium'
            noOfLines={!show ? 2 : undefined}
            lineHeight='20px'
          >
            {description}
          </Text>
          <Text
            color='transparent'
            mt={2}
            fontSize={'md'}
            fontWeight='medium'
            // noOfLines={!show ? 2 : undefined}
            lineHeight='20px'
            ref={ref}
            position='absolute'
            left={0}
            right={0}
            top={9}
            zIndex={-1}
          >
            {description}
          </Text>
          {!!current?.offsetHeight && current?.offsetHeight > 40 && (
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
              px={4}
              py={2}
              ml={-4}
              hidden={!description}
            >
              {show ? 'Less' : 'More'}
            </Box>
          )}
        </Box>
      </Flex>

      <HStack
        columnGap={20}
        rowGap={4}
        wrap='wrap'
        alignItems={'flex-start'}
        justify='flex-start'
      >
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {floorPrice || '--'}
            </Heading>
          </Flex>

          <Text color='gray.4'>Floor price</Text>
        </Flex>
        {/* min dp */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {formatFloat(
                BigNumber(floorPrice)
                  .multipliedBy(BigNumber(10000).minus(Number(highestRate)))
                  .dividedBy(10000)
                  .toNumber(),
              ) || '--'}
            </Heading>
          </Flex>

          <Text color='gray.4'>Min DP</Text>
        </Flex>
        {/* 24h */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {formatFloat(oneDayAveragePrice) || '--'}
            </Heading>
          </Flex>

          <Text color={oneDayChange < 0 ? 'red.1' : 'green.1'}>
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
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {totalSupply.toLocaleString() || '--'}
            </Heading>
          </Flex>

          <Text color='gray.4'>Supply</Text>
        </Flex>
        {/* listing */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {totalSales?.toLocaleString() || '--'}
            </Heading>
          </Flex>

          <Text color='gray.4'>Listing</Text>
        </Flex>
      </HStack>
    </Box>
  )
}
export default CollectionDescription
