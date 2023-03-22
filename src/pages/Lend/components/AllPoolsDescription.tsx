import {
  Box,
  Flex,
  Heading,
  // HStack,
  Text,
} from '@chakra-ui/react'

import { ImageWithFallback } from '@/components'

import type { ReactElement, FunctionComponent } from 'react'

const AllPoolsDescription: FunctionComponent<{
  data: {
    titleImage?: string
    title?: string | ReactElement
    description?: string | ReactElement
    img?: string
    keys?: {
      value: string | ReactElement
      label: string | ReactElement
    }[]
  }
}> = ({
  data: {
    title = '',
    description = '',
    img = '',
    // keys = []
  },
}) => {
  return (
    <Flex
      justify={{
        xs: 'center',
        sm: 'center',
        md: 'space-between',
      }}
      alignItems='center'
      wrap='wrap'
    >
      <Box
        maxW={{
          md: '40%',
          xl: '50%',
          sm: '100%',
          xs: '100%',
        }}
      >
        {typeof title === 'string' ? (
          <Heading fontSize={'6xl'}>{title}</Heading>
        ) : (
          title
        )}
        {typeof description === 'string' ? (
          <Text
            color='gray.3'
            mt={2}
            mb={10}
            fontSize={'xl'}
            fontWeight='medium'
            whiteSpace={'pre-wrap'}
          >
            {description}
          </Text>
        ) : (
          description
        )}
        {/* 
        <HStack spacing={10}>
          {keys.map(({ label, value }) => (
            <Box key={`${label}`}>
              {typeof value === 'string' ? (
                <Heading fontSize={'3xl'}>{value}</Heading>
              ) : (
                value
              )}
              {typeof label === 'string' ? (
                <Text color={`var(--chakra-colors-gray-4)`}>{label}</Text>
              ) : (
                label
              )}
            </Box>
          ))}
        </HStack> */}
      </Box>
      <ImageWithFallback
        src={img}
        w={{
          xs: '100%',
          sm: '100%',
          md: '440px',
        }}
        h={{
          xs: '100%',
          sm: 'auto',
          md: '218px',
        }}
      />
    </Flex>
  )
}

/**
 * 
 *  keys: [
              {
                label: 'Collections',
                value: '51',
              },
              {
                label: 'Historical Lent Out',
                value: (
                  <Flex alignItems={'center'}>
                    <SvgComponent svgId='icon-eth' height={8} />
                    <Heading fontSize={'3xl'}>1,859.8</Heading>
                  </Flex>
                ),
              },
              {
                label: 'Total Value Locked',
                value: '$1.35M',
              },
            ],
 */

export default AllPoolsDescription
