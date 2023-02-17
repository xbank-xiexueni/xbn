import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import type { ColumnProps } from '@/components/my-table'
import { UNIT } from '@/constants'

export const activeCollectionColumns: ColumnProps[] = [
  {
    title: 'Collection',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => (
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
    render: (data: Record<string, string | number | boolean>) => {
      return (
        <Flex
          _hover={{
            bg: 'white',
          }}
          py={2}
          px={3}
          borderRadius={8}
        >
          <Link to={`/lend/my-pools/create`} state={data}>
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
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => (
      <Flex alignItems={'center'} gap={2}>
        <Image src={_.img as string} w={10} h={10} borderRadius={4} />
        <Text>
          {`${value}`?.length > 8 ? `${`${value}`.substring(0, 8)}...` : value}
        </Text>
      </Flex>
    ),
  },
  {
    title: 'Lender',
    dataIndex: 'col2',
    key: 'col2',
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => (
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
    dataIndex: 'col3',
    key: 'col3',
    thAlign: 'right',
    align: 'right',
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => (
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
    dataIndex: 'col7',
    thAlign: 'right',
    align: 'right',
    key: 'col7',
  },
  {
    title: 'Loan value',
    dataIndex: 'col4',
    align: 'right',
    thAlign: 'right',
    key: 'col4',
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => (
      <Text>
        {value} {UNIT}
      </Text>
    ),
  },
  {
    title: 'Duration',
    dataIndex: 'col5',
    align: 'right',
    thAlign: 'right',
    key: 'col5',
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => <Text>{value} days</Text>,
  },
  {
    title: 'Interest',
    dataIndex: 'col6',
    align: 'right',
    key: 'col6',
    thAlign: 'right',
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => <Text>{value} ETH</Text>,
  },
]
