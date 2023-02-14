import {
  Flex,
  Box,
  Image,
  Text,
  Heading,
  HStack,
  Skeleton,
} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import { useState, type FunctionComponent, type ReactElement } from 'react'

import { SvgComponent } from '@/components'

const CollectionDescription: FunctionComponent<{
  data?: {
    isVerified?: boolean
    titleImage?: string
    title?: string
    description?: string
    img?: string
    keys?: {
      value: string
      label: string | ReactElement
      isEth?: boolean
    }[]
  }
  loading?: boolean
}> = ({ data, loading }) => {
  const [show, setShow] = useState(false)
  if (isEmpty(data) || loading) {
    return (
      <Flex flexDirection={'column'} mb={12}>
        <Flex mb={4} gap={3}>
          <Skeleton h='108px' w='108px' borderRadius={8} />
          <Skeleton h='108px' w={'500px'} borderRadius={16} />
        </Flex>
        <Skeleton h='100px' borderRadius={16} />
      </Flex>
    )
  }
  const {
    title = '',
    description = '',
    img = '',
    keys = [],
    isVerified = false,
  } = data

  return (
    <Box mb={12}>
      <Flex gap={5} mb={8}>
        <Box minW='108px'>
          <Image src={img} />
        </Box>
        <Box>
          <Flex>
            <Heading fontSize={'3xl'} display='flex'>
              {title}
            </Heading>
            {isVerified && <SvgComponent svgId='icon-verified-fill' />}
          </Flex>

          <Text color='gray.3' mt={2} fontSize={'md'} fontWeight='medium'>
            {show ? description : `${description.substring(0, 80)}`}
            {description?.length > 80 && !show && '...'}
            {description?.length > 80 && (
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
      </HStack>
    </Box>
  )
}
export default CollectionDescription
