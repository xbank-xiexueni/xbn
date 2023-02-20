import {
  Box,
  Heading,
  List,
  Flex,
  Text,
  Highlight,
  Image,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import groupBy from 'lodash-es/groupBy'
import isEmpty from 'lodash-es/isEmpty'
import { useCallback, useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// import { SearchInput } from '@/components'
import { apiGetBuyerLoans } from '@/api'
import {
  ConnectWalletModal,
  EmptyComponent,
  LoadingComponent,
  SvgComponent,
  TableList,
} from '@/components'
import type { ColumnProps } from '@/components/my-table'
import { UNIT } from '@/constants'
import { useWallet } from '@/hooks'

import CollectionListItem from './components/CollectionListItem'

export const loansForBuyerColumns: ColumnProps[] = [
  {
    title: 'Asset',
    dataIndex: 'col1',
    key: 'col1',
    align: 'left',
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => (
      <Flex alignItems={'center'} gap={2}>
        <Image src={_.img as string} w={10} h={10} borderRadius={4} />
        <Text>{value}</Text>
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
    key: 'col7',
  },
  {
    title: 'Loan value',
    dataIndex: 'col4',
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
    key: 'col5',
    render: (
      _: Record<string, string | number | boolean>,
      value: string | number | boolean,
    ) => <Text>{value} days</Text>,
  },
  {
    title: 'Interest',
    dataIndex: 'col6',
    key: 'col6',
    render: (
      _: Record<string, string | boolean | number>,
      value: string | boolean | number,
    ) => (
      <Text>
        {value} {UNIT}
      </Text>
    ),
  },
]

const Loans = () => {
  // const navigate = useNavigate()
  const { isOpen, onClose, interceptFn, currentAccount } = useWallet()

  useEffect(() => interceptFn(), [interceptFn])

  const [selectCollection, setSelectCollection] = useState<number>(-1)

  // -1 代表全选

  const { loading, data } = useRequest(apiGetBuyerLoans, {
    ready: !!currentAccount,
    debounceWait: 100,
  })

  const currentCollectionLoans = useMemo(() => {
    return data?.data?.list?.filter(
      (item: any) =>
        item.collectionId === selectCollection || selectCollection === -1,
    )
  }, [data, selectCollection])

  const statuedLoans = useMemo(
    () => groupBy(currentCollectionLoans, 'status'),
    [currentCollectionLoans],
  )

  const collectionList = useMemo(() => {
    const arr = data?.data?.list || []
    if (isEmpty(arr)) {
      return []
    }
    const res: { id: number; name: string; img: string }[] = []
    arr.forEach((element: any) => {
      if (isEmpty(res.find((i) => i.id === element.collectionId))) {
        res.push({
          id: element.collectionId,
          name: element.collectionName,
          img: element.collectionImg,
        })
      }
    })
    return res
  }, [data])

  const getCollectionLength = useCallback(
    (targetId: string) => {
      return data?.data?.list?.filter((i: any) => i.collectionId === targetId)
        .length
    },
    [data],
  )

  return (
    <Box>
      <Heading size={'2xl'} my='60px'>
        Loans
      </Heading>

      <Flex justify={'space-between'} mt={4}>
        <Box
          border={`1px solid var(--chakra-colors-gray-2)`}
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
            {isEmpty(collectionList) && <EmptyComponent />}
            {!isEmpty(collectionList) && (
              <Flex
                justify={'space-between'}
                py={3}
                px={4}
                alignItems='center'
                borderRadius={8}
                border={`1px solid var(--chakra-colors-gray-2)`}
                cursor='pointer'
                onClick={() => {
                  setSelectCollection(-1)
                }}
                bg={selectCollection === -1 ? 'blue.2' : 'white'}
              >
                <Text fontSize={'sm'} fontWeight='700'>
                  All my Collections
                </Text>
                {selectCollection === -1 ? (
                  <SvgComponent svgId='icon-checked' />
                ) : (
                  <Text fontSize={'sm'}>{10}</Text>
                )}
              </Flex>
            )}

            {!isEmpty(collectionList) &&
              collectionList.map((item: any) => (
                <CollectionListItem
                  data={{ ...item }}
                  key={item.id}
                  onClick={() => setSelectCollection(item.id)}
                  isActive={selectCollection === item.id}
                  count={getCollectionLength(item.id)}
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
                tableTitle: () => (
                  <Heading size={'md'} mt={6}>
                    Current Loans as Borrower
                  </Heading>
                ),
                // loading: loading,
                columns: [
                  ...loansForBuyerColumns,
                  {
                    title: 'next payment date',
                    dataIndex: 'col10',
                    key: 'col10',
                  },
                  {
                    title: 'amount',
                    dataIndex: 'col9',
                    key: 'col9',
                    render: (
                      _: Record<string, string | boolean | number>,
                      value: string | boolean | number,
                    ) => (
                      <Text>
                        {value} {UNIT}
                      </Text>
                    ),
                  },
                  {
                    title: '',
                    dataIndex: 'id',
                    key: 'id',
                    fixedRight: true,
                    render: () => (
                      <Box
                        px={3}
                        bg='white'
                        borderRadius={8}
                        cursor='pointer'
                        onClick={() => {
                          interceptFn(() => {
                            console.log('11')
                          })
                        }}
                      >
                        <Text color='blue.1' fontSize='sm' fontWeight={'700'}>
                          Repay
                        </Text>
                      </Box>
                    ),
                  },
                ],

                loading: loading,
                data: statuedLoans[1],
                key: '1',
              },
              {
                tableTitle: () => (
                  <Heading size={'md'} mt={6}>
                    <Highlight
                      styles={{
                        fontSize: '18px',
                        fontWeight: 500,
                        color: `gray.3`,
                      }}
                      query='(Paid Off)'
                    >
                      Previous Loans as Borrower(Paid Off)
                    </Highlight>
                  </Heading>
                ),

                columns: loansForBuyerColumns,
                loading: loading,
                data: statuedLoans[2],
                key: '2',
              },
              {
                tableTitle: () => (
                  <Heading size={'md'} mt={6}>
                    <Highlight
                      styles={{
                        fontSize: '18px',
                        fontWeight: 500,
                        color: `gray.3`,
                      }}
                      query='(Overdue)'
                    >
                      Previous Loans as Borrower(Overdue)
                    </Highlight>
                  </Heading>
                ),
                columns: loansForBuyerColumns,
                loading: loading,
                data: statuedLoans[3],
                key: '3',
              },
            ]}
          />
        </Box>
      </Flex>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </Box>
  )
}

export default Loans
