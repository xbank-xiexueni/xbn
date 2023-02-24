import {
  Flex,
  Box,
  Text,
  Heading,
  // HStack,
  Skeleton,
} from '@chakra-ui/react'
import isEmpty from 'lodash-es/isEmpty'
import { useState, type FunctionComponent } from 'react'

import { EmptyComponent, ImageWithFallback, SvgComponent } from '@/components'

const CollectionDescription: FunctionComponent<{
  data?: {
    isVerified?: boolean
    name?: string
    description?: string
    image_url?: string
    // keys?: {
    //   value: string
    //   label: string | ReactElement
    //   isEth?: boolean
    // }[]
  }
  loading?: boolean
}> = ({ data, loading }) => {
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
    image_url = '',
    // keys = [],
    isVerified = false,
  } = data

  return (
    <Box mb={12}>
      <Flex gap={5} mb={8}>
        <ImageWithFallback
          src={image_url}
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
            {isVerified && <SvgComponent svgId='icon-verified-fill' />}
          </Flex>

          <Text color='gray.3' mt={2} fontSize={'md'} fontWeight='medium'>
            {show ? description : `${description.substring(0, 200)}`}
            {description?.length > 200 && !show && '...'}
            {description?.length > 200 && (
              <Box
                as='a'
                color='blue.1'
                onClick={() => setShow((prev) => !prev)}
                cursor='pointer'
                fontWeight={700}
                borderRadius='50%'
                _hover={{
                  bg: 'gray.5',
                }}
                p={3}
              >
                {show ? 'Less' : 'More'}
              </Box>
            )}
          </Text>
        </Box>
      </Flex>
      {/* 
      <HStack spacing={10}>
        {keys.map(({ label, value, isEth }) => (
          <Flex key={`${label}`} flexDir='column' alignItems='center'>
            <Flex alignItems={'baseline'}>
              {isEth && <SvgComponent svgId='icon-eth' svgSize='20px' mr={1} />}

              <Heading fontSize={'2xl'} display='flex' mb={1}>
                {value}
              </Heading>
            </Flex>

            {typeof label === 'string' ? (
              <Text color='gray.4'>{label}</Text>
            ) : (
              label
            )}
          </Flex>
        ))}
      </HStack> */}
    </Box>
  )
}
export default CollectionDescription
