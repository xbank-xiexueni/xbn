import { Flex, Text, type FlexProps } from '@chakra-ui/react'

import { SvgComponent } from '@/components'

import type { FunctionComponent } from 'react'

const AmountItem: FunctionComponent<
  FlexProps & {
    data: number | string
    label: string
    loading?: boolean
  }
> = ({ data, label, loading = false, ...rest }) => {
  return (
    <Flex flexDir={'column'} justify='center' gap={'8px'} {...rest}>
      <Flex
        fontWeight={'500'}
        color='gray.3'
        justify={'center'}
        fontSize={{
          md: '16px',
          sm: '12px',
          xs: '12px',
        }}
        transform={{
          md: 'none',
          sm: 'scale(0.83333)',
          xs: 'scale(0.83333)',
        }}
        transformOrigin='center'
      >
        {label}
      </Flex>
      <Flex justify={'center'} alignItems='center' h='35px'>
        <SvgComponent svgId='icon-eth' svgSize={'18px'} />

        {loading ? (
          <SvgComponent
            svgId='icon-refresh'
            animation={'loading 1s linear infinite'}
            cursor={'pointer'}
          />
        ) : (
          <Text
            fontSize={{
              md: '24px',
              sm: '18px',
              xs: '18px',
            }}
            fontStyle='700'
            noOfLines={1}
          >
            {data}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default AmountItem
