import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import type { ColumnProps } from '@/components/table/Table'

export const activeCollectionColumns: ColumnProps[] = [
  {
    title: 'Collection',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    render: (_, value) => (
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
    render: (data) => {
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
    render: (_, value) => (
      <Flex alignItems={'center'} gap={2}>
        <Box w={10} h={10} bg='pink' borderRadius={4} />
        <Text>{value}</Text>
      </Flex>
    ),
  },
  {
    title: 'Lender',
    dataIndex: 'col2',
    key: 'col2',
  },
  {
    title: 'Borrower',
    dataIndex: 'col3',
    key: 'col3',
  },
  {
    title: 'Loan value',
    dataIndex: 'col4',
    key: 'col4',
  },
  {
    title: 'Duration',
    dataIndex: 'col5',
    key: 'col5',
  },
  {
    title: 'Interest',
    dataIndex: 'col6',
    key: 'col6',
  },
]
