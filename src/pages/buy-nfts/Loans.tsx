import {
  Box,
  Heading,
  List,
  Flex,
  Text,
  Image,
  Highlight,
  useDisclosure,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// import { SearchInput } from '@/components'
import { apiGetBuyerLoans } from '@/api/buyer'
import { ConnectWalletModal, LoadingComponent, TableList } from '@/components'
import type { ColumnProps } from '@/components/table/Table'
import { TransactionContext } from '@/context/TransactionContext'
import COLORS from '@/utils/Colors'

import IconChecked from '@/assets/icon/icon-checked.svg'

import CollectionListItem from './components/CollectionListItem'

export const loansForBuyerColumns: ColumnProps[] = [
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
  const { currentAccount } = useContext(TransactionContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const interceptFn = useCallback(
    (fn?: () => void) => {
      // 判断是否连接钱包
      if (!currentAccount) {
        onOpen()
        return
      }
      if (fn) {
        fn()
      }
    },
    [currentAccount, onOpen],
  )

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
    const res: { id: number; name: string }[] = []
    arr.forEach((element: any) => {
      if (isEmpty(res.find((i) => i.id === element.collectionId))) {
        res.push({
          id: element.collectionId,
          name: element.collectionName,
        })
      }
    })
    return res
  }, [data])

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
              onClick={() => {
                setSelectCollection(-1)
              }}
              bg={selectCollection === -1 ? COLORS.secondaryColor : 'white'}
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
            {collectionList.map((item: any) => (
              <CollectionListItem
                data={{ ...item }}
                key={item.id}
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
                    dataIndex: 'col8',
                    key: 'col8',
                  },
                  {
                    title: 'next payment date',
                    dataIndex: 'col9',
                    key: 'col9',
                  },
                  {
                    title: '',
                    dataIndex: 'id',
                    key: 'id',
                    fixedRight: true,
                    render: () => (
                      <Box px={3} bg='white' borderRadius={8}>
                        <Text
                          color={COLORS.primaryColor}
                          fontSize='sm'
                          fontWeight={'700'}
                        >
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
                        color: COLORS.secondaryTextColor,
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
                        color: COLORS.secondaryTextColor,
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
