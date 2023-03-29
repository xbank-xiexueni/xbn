import {
  Box,
  Flex,
  Heading,
  Skeleton,
  // HStack,
  Text,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import BigNumber from 'bignumber.js'
import reduce from 'lodash/reduce'
import numeral from 'numeral'
import { useCallback } from 'react'

import { ImageWithFallback, SvgComponent } from '@/components'
import { createXBankContract } from '@/utils/createContract'
import { formatFloat } from '@/utils/format'
import { wei2Eth } from '@/utils/unit-conversion'

import type { FlexProps } from '@chakra-ui/react'
import type { ReactElement, FunctionComponent } from 'react'

const Item: FunctionComponent<
  FlexProps & {
    label: string
    value?: string | number
    isEth?: boolean
    isDollar?: boolean
  }
> = ({ label, value, isDollar, isEth, ...rest }) => (
  <Flex flexDir={'column'} alignItems='center' {...rest}>
    <Flex alignItems={'center'} mb={'4px'}>
      {isEth && <SvgComponent svgId='icon-eth' svgSize='20px' />}
      <Text
        color={'black.3'}
        fontWeight='700'
        fontSize={{
          md: '28px',
          sm: '20px',
          xs: '20px',
        }}
      >
        {isDollar && '$'}
        {value || '--'}
      </Text>
    </Flex>
    <Text
      color='gray.4'
      fontSize={{
        md: '14px',
        sm: '12px',
        xs: '12px',
      }}
      fontWeight='500'
    >
      {label}
    </Text>
  </Flex>
)

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
}> = ({ data: { title = '', description = '', img = '' } }) => {
  const fetchSummaryData = useCallback(async () => {
    const xbankContract = createXBankContract()
    const listPool = await xbankContract.methods.listPool().call()
    const listLoan = await xbankContract.methods.listLoan().call()
    const collectionWithPools = [
      ...new Set(listPool.map((item: any) => item.allowCollateralContract)),
    ]
    const totalLoanRepaymentAmount = reduce(
      listLoan,
      (sum, i) => BigNumber(sum).plus(BigNumber(i.loanRepaymentAmount)),
      BigNumber(0),
    )
    const totalPoolAmount = reduce(
      listPool,
      (sum, i) => BigNumber(sum).plus(BigNumber(i.poolAmount)),
      BigNumber(0),
    )

    return {
      collectionCount: collectionWithPools?.length,
      totalLoanRepaymentAmount,
      totalPoolAmount,
    }
  }, [])

  const { data, loading } = useRequest(fetchSummaryData, {
    retryCount: 5,
  })
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
          <Heading
            fontSize={{
              md: '64px',
              sm: '24px',
              xs: '24px',
            }}
          >
            {title}
          </Heading>
        ) : (
          title
        )}
        {typeof description === 'string' ? (
          <Text
            color='gray.3'
            mt={'8px'}
            mb={{ md: '40px', sm: '32px', xs: '32px' }}
            fontSize={{ md: '20px', sm: '14px', xs: '14px' }}
            fontWeight='medium'
            whiteSpace={'pre-wrap'}
          >
            {description}
          </Text>
        ) : (
          description
        )}
        {/* 总览数据 */}
        {loading || !data ? (
          <Skeleton
            w={{
              md: '500px',
              sm: '100%',
              xs: '100%',
            }}
            borderRadius={16}
            h={{
              md: '66px',
              sm: '44px',
              xs: '44px',
            }}
            mb={{
              md: 0,
              sm: '30px',
              xs: '30px',
            }}
          />
        ) : (
          <Flex
            alignItems={'center'}
            rowGap='80px'
            columnGap={'16px'}
            flexWrap='wrap'
            pb={{
              md: 0,
              sm: '30px',
              xs: '30px',
            }}
          >
            <Item label='Collection' value={data?.collectionCount} />
            <Item
              label='Historical Lent Out'
              value={formatFloat(
                Number(wei2Eth(data?.totalLoanRepaymentAmount.toNumber())),
              )}
              isEth
            />
            <Item
              label='Total Value Locked'
              value={numeral(wei2Eth(data?.totalPoolAmount)).format('0.00 a')}
              isDollar
            />
          </Flex>
        )}
      </Box>
      <ImageWithFallback
        src={img}
        w={{
          xs: '100%',
          sm: '326px',
          md: '440px',
        }}
        h={{
          xs: 'auto',
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
