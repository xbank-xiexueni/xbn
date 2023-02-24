import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { ImageWithFallback } from '@/components'
import type { ColumnProps } from '@/components/my-table'
import { UNIT } from '@/constants'

export const activeCollectionColumns: ColumnProps[] = [
  {
    title: 'Collection',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    render: (_: Record<string, any>, value: any) => (
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
    render: (data: Record<string, any>) => {
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
    render: (_: Record<string, any>, value: any) => {
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
    render: (_: Record<string, any>, value: any) => (
      <Text>
        {value.toString().substring(0, 5)}...
        {value
          .toString()
          .substring(value.toString().length - 4, value.toString().length)}
      </Text>
    ),
  },
  {
    title: 'Borrower',
    dataIndex: 'borrower_address',
    key: 'borrower_address',
    thAlign: 'right',
    align: 'right',
    render: (_: Record<string, any>, value: any) => (
      <Text>
        {value.toString().substring(0, 5)}...
        {value
          .toString()
          .substring(value.toString().length - 4, value.toString().length)}
      </Text>
    ),
  },
  {
    title: 'Start time',
    dataIndex: 'loan_start_time',
    thAlign: 'right',
    align: 'right',
    key: 'loan_start_time',
  },
  {
    title: 'Loan value',
    dataIndex: 'total_repayment',
    align: 'right',
    thAlign: 'right',
    key: 'total_repayment',
    render: (_: Record<string, any>, value: any) => (
      <Text>
        {value} {UNIT}
      </Text>
    ),
  },
  {
    title: 'Duration',
    dataIndex: 'loan_duration',
    align: 'right',
    thAlign: 'right',
    key: 'loan_duration',
    render: (_: Record<string, any>, value: any) => <Text>{value} days</Text>,
  },
  {
    title: 'Interest',
    dataIndex: 'pool_interest_rate',
    align: 'right',
    key: 'pool_interest_rate',
    thAlign: 'right',
    render: (_: Record<string, any>, value: any) => <Text>{value} ETH</Text>,
  },
]
