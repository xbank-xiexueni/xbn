import { Flex, Box, Text, Heading, Skeleton, HStack } from '@chakra-ui/react'
import isEmpty from 'lodash-es/isEmpty'
import { useState, type FunctionComponent } from 'react'

import { EmptyComponent, ImageWithFallback, SvgComponent } from '@/components'
import type { NftCollection } from '@/hooks'

const CollectionDescription: FunctionComponent<{
  data?: NftCollection
  loading?: boolean
  highestRate?: number
}> = ({ data, loading, highestRate }) => {
  const [show, setShow] = useState(false)
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
    nftCollectionStat: { floorPrice, totalSupply },
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
        <Box>
          <Flex>
            <Heading
              fontSize={{ lg: '3xl', md: 'xl', sm: 'xl' }}
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
          >
            {description}
          </Text>
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
          >
            {show ? 'Less' : 'More'}
          </Box>
        </Box>
      </Flex>

      <HStack spacing={10}>
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {floorPrice}
            </Heading>
          </Flex>

          <Text color='gray.4'>Floor price</Text>
        </Flex>
        {/* min dp */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {(floorPrice * (10000 - Number(highestRate))) / 10000}
            </Heading>
          </Flex>

          <Text color='gray.4'>Min DP</Text>
        </Flex>
        {/* 24h */}
        {/* <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <SvgComponent svgId='icon-eth' svgSize='20px' />
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {floorPrice}
            </Heading>
          </Flex>

          <Text color='red.1'>
            <Highlight
              styles={{
                color: `gray.4`,
              }}
              query='24h'
            >
              24h -90%
            </Highlight>
          </Text>
        </Flex> */}
        {/* supply */}
        <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {totalSupply.toLocaleString()}
            </Heading>
          </Flex>

          <Text color='gray.4'>Supply</Text>
        </Flex>
        {/* listing */}
        {/* <Flex flexDir='column' alignItems='center'>
          <Flex alignItems={'center'}>
            <Heading fontSize={'24px'} fontWeight='700' display='flex' mb={1}>
              {totalSupply}
            </Heading>
          </Flex>

          <Text color='gray.4'>Listing</Text>
        </Flex> */}
      </HStack>
    </Box>
  )
}
export default CollectionDescription
