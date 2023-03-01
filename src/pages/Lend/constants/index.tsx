import { Box, Flex, Text } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { unix } from 'dayjs'
import { Link } from 'react-router-dom'

import { ImageWithFallback } from '@/components'
import type { ColumnProps } from '@/components/my-table'
import { FORMAT_NUMBER, UNIT } from '@/constants'
import { amortizationCalByDays } from '@/utils/calculation'
import formatAddress from '@/utils/formatAddress'
import { wei2Eth } from '@/utils/unit-conversion'

export const activeCollectionColumns: ColumnProps[] = [
  {
    title: 'Collection',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    render: (value: any) => (
      <Flex alignItems={'center'} gap={2}>
        <Box w={10} h={10} bg='pink' borderRadius={4} />
        <Text>{value}</Text>
      </Flex>
    ),
  },
  {
    title: 'Est. Floor*',
    dataIndex: 'col2',
    key: 'col2',
  },
  {
    title: 'TVL (USD)',
    dataIndex: 'col3',
    key: 'col3',
    // sortable: true,
  },
  {
    title: 'Collateral Factor',
    dataIndex: 'col4',
    key: 'col4',
  },
  {
    title: 'Interest',
    dataIndex: 'col5',
    key: 'Interest',
  },
  {
    title: 'Trade',
    dataIndex: 'id',
    key: 'id',
    align: 'right',
    thAlign: 'right',
    fixedRight: true,
    render: (_: any, data: Record<string, any>) => {
      return (
        <Flex
          _hover={{
            bg: 'white',
          }}
          py={2}
          px={3}
          borderRadius={8}
        >
          <Link to={`/lending/my-pools/create`} state={data}>
            <Text>Supply</Text>
          </Link>
        </Flex>
      )
    },
  },
]

export const loansForLendColumns: ColumnProps[] = [
  {
    title: 'Asset',
    dataIndex: 'col1',
    key: 'col1',
    align: 'left',
    width: 160,
    render: (value: any, _: Record<string, any>) => {
      return (
        <Flex alignItems={'center'} gap={2}>
          <ImageWithFallback
            src={_.img as string}
            w={10}
            h={10}
            borderRadius={4}
          />
          <Text
            w={'80%'}
            display='inline-block'
            overflow='hidden'
            whiteSpace='nowrap'
            textOverflow='ellipsis'
          >
            {value}
          </Text>
        </Flex>
      )
    },
  },
  {
    title: 'Lender',
    dataIndex: 'lender_address',
    key: 'lender_address',
    render: (value: any) => <Text>{formatAddress(value.toString())}</Text>,
  },
  {
    title: 'Borrower',
    dataIndex: 'borrower_address',
    key: 'borrower_address',
    thAlign: 'right',
    align: 'right',
    render: (value: any) => <Text>{formatAddress(value.toString())}</Text>,
  },
  {
    title: 'Start time',
    dataIndex: 'loan_start_time',
    thAlign: 'right',
    align: 'right',
    key: 'loan_start_time',
    render: (value: any) => <Text>{unix(value).format('YYYY-MM-DD')}</Text>,
  },
  {
    title: 'Loan value',
    dataIndex: 'total_repayment',
    align: 'right',
    thAlign: 'right',
    key: 'total_repayment',
    render: (value: any) => (
      <Text>
        {wei2Eth(value)} {UNIT}
      </Text>
    ),
  },
  {
    title: 'Duration',
    dataIndex: 'loan_duration',
    align: 'right',
    thAlign: 'right',
    key: 'loan_duration',
    render: (value: any) => <Text>{value / 24 / 60 / 60} days</Text>,
  },
  {
    title: 'Interest',
    dataIndex: 'pool_interest_rate',
    align: 'right',
    key: 'pool_interest_rate',
    thAlign: 'right',
    render: (_: any, data: Record<string, any>) => (
      <Text>
        {BigNumber(
          wei2Eth(
            amortizationCalByDays(
              data.total_repayment,
              data.loan_interest_rate / 10000,
              (data.loan_duration / 24 / 60 / 60) as 7 | 14 | 30 | 60 | 90,
              data.repay_times,
            )
              .multipliedBy(data.repay_times)
              .minus(data.total_repayment)
              .toNumber(),
          ),
        ).toFormat(FORMAT_NUMBER)}
        &nbsp; ETH
      </Text>
    ),
  },
]
