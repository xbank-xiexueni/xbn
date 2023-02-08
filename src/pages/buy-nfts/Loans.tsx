import { Box, Heading, List, Flex, Text, Image } from '@chakra-ui/react'
import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// import { SearchInput } from '@/components'
import { LoadingComponent, TableList } from '@/components'
import type { ColumnProps } from '@/components/table/Table'
import COLORS from '@/utils/Colors'

import IconChecked from '@/assets/icon/icon-checked.svg'

import CollectionListItem from './components/CollectionListItem'

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
    title: 'Start time',
    dataIndex: 'col7',
    key: 'col7',
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

const Loans = () => {
  // const navigate = useNavigate()

  const [selectCollection, setSelectCollection] = useState<number>()
  return (
    <Box>
      <Heading size={'2xl'} my='60px'>
        Loans
      </Heading>

      <Flex justify={'space-between'} mt={4}>
        <Box
          border={`1px solid ${COLORS.borderColor}`}
          borderRadius={12}
          p={6}
          w={{
            lg: '25%',
            md: '30%',
          }}
        >
          <Heading size={'md'} mb={4}>
            Collections
          </Heading>
          {/* <SearchInput placeholder='Collections...' /> */}

          <List spacing={4} mt={4} position='relative'>
            <LoadingComponent loading={false} />
            <Flex
              justify={'space-between'}
              py={3}
              px={4}
              alignItems='center'
              borderRadius={8}
              border={`1px solid ${COLORS.borderColor}`}
              cursor='pointer'
              // bg={
              //   selectKeyForOpenLoans === -1
              //     ? COLORS.secondaryColor
              //     : 'white'
              // }
            >
              <Text fontSize={'sm'} fontWeight='700'>
                All my Collections
              </Text>
              {selectCollection === -1 ? (
                <Image src={IconChecked} />
              ) : (
                <Text fontSize={'sm'}>{10}</Text>
              )}
            </Flex>
            {[{ id: 1 }].map((item: any) => (
              <CollectionListItem
                data={{ ...item }}
                key={JSON.stringify(item)}
                onClick={() => setSelectCollection(item.id)}
                isActive={selectCollection === item.id}
              />
            ))}
          </List>
        </Box>
        <Box
          w={{
            lg: '72%',
            md: '65%',
          }}
        >
          <TableList
            tables={[
              {
                title: 'Current Loans as Borrower',
                // loading: loading,
                columns: loansForLendColumns,

                data: [],
              },
              {
                title: 'Previous Loans as Borrower(Paid off)',
                columns: loansForLendColumns,
                data: [],
              },
              {
                title: 'Previous Loans as Borrower(Overdue)',
                columns: loansForLendColumns,
                data: [],
              },
            ]}
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default Loans