import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Heading,
  Tag,
  List,
  Highlight,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
// import debounce from 'lodash-es/debounce'
import { ethers } from 'ethers'
import groupBy from 'lodash-es/groupBy'
import isEmpty from 'lodash-es/isEmpty'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  apiGetLoans,
  // apiGetActiveCollection,
  apiGetPools,
  type PoolsListItemType,
} from '@/api'
import ImgLend from '@/assets/LEND.png'
import {
  ConnectWalletModal,
  // SearchInput,
  // Pagination,
  MyTable,
  LoadingComponent,
  TableList,
  EmptyComponent,
  SvgComponent,
  EthText,
  ImageWithFallback,
} from '@/components'
import type { ColumnProps } from '@/components/my-table'
// import { TransactionContext } from '@/context/TransactionContext'
import { useWallet } from '@/hooks'

import CollectionListItem from '../buy-nfts/components/CollectionListItem'

import AllPoolsDescription from './components/AllPoolsDescription'
import {
  // activeCollectionColumns,
  loansForLendColumns,
} from './constants'

type Dictionary<T> = Record<string, T>

const Lend = () => {
  const [tabKey, setTabKey] = useState<0 | 1 | 2>()

  const { isOpen, onClose, interceptFn, currentAccount } = useWallet()

  // const [showSearch, setShowSearch] = useState(false)

  // active collections
  // const [activeCollectionData, setActiveCollectionData] = useState({
  //   list: [],
  //   meta: {
  //     current: 1,
  //     total: 0,
  //   },
  // })
  // const { loading: loading1, run: handleFetchActiveCollections } = useRequest(
  //   apiGetActiveCollection,
  //   {
  //     onSuccess: (data: {
  //       data: { list: any; meta: { pageNo: any; totalRecord: any } }
  //     }) => {
  //       setActiveCollectionData({
  //         list: data?.data?.list,
  //         meta: {
  //           current: data?.data?.meta?.pageNo,
  //           total: data?.data?.meta?.totalRecord,
  //         },
  //       })
  //     },
  //     ready: tabKey === 0,
  //   },
  // )
  // const [activeCollectionSearch, setSearchForActiveCollection] = useState('')
  // const handleSearchActiveCollections = useMemo(() => {
  //   const searchFn = async (value: string) => {
  //     if (value) {
  //       handleFetchActiveCollections()
  //     }
  //   }
  //   return debounce(searchFn, 1000)
  // }, [handleFetchActiveCollections])

  // my pools
  const [myPoolsData, setMyPoolsData] = useState<PoolsListItemType[]>([])

  const { loading: myPoolsLoading } = useRequest(apiGetPools, {
    onSuccess: ({ data }) => {
      if (isEmpty(data)) return
      setMyPoolsData(data)
    },
    ready: !!currentAccount,
    debounceWait: 10,
    defaultParams: [
      {
        owner_address: currentAccount,
      },
    ],
    onError: (error) => {
      console.log('🚀 ~ file: Lend.tsx:123 ~ Lend ~ error:', error)
    },
  })
  // const [myPoolsSearch, setSearchForMyPools] = useState('')
  // const handleSearchMyPools = useMemo(() => {
  //   const searchFn = async (value: string) => {
  //     if (value) {
  //       handleFetchMyPools()
  //     }
  //   }
  //   return debounce(searchFn, 1000)
  // }, [handleFetchMyPools])

  // open loans
  // 左侧 collections
  // const [allMyPoolsList, setAllMyPoolsList] = useState([])
  // const { loading: loading3 } = useRequest(apiGetPools, {
  //   onSuccess: (data: { data: { list: any } }) => {
  //     setAllMyPoolsList(data?.data?.list)
  //   },
  //   ready: !!currentAccount && tabKey === 1,
  // })
  // 三个表格的请求
  const [loansData, setLoansData] = useState<Dictionary<any[]>>({
    1: [],
    2: [],
    3: [],
  })

  // -1 代表全选
  const [selectKeyForOpenLoans, setSelectKeyForOpenLoans] = useState<number>()

  const { loading: loansLoading, runAsync: fetchLoansByPool } = useRequest(
    apiGetLoans,
    {
      onSuccess: ({ data }) => {
        setLoansData(groupBy(data, 'loan_status'))
      },
      ready: tabKey === 1 && !!currentAccount,
      refreshDeps: [selectKeyForOpenLoans],
      defaultParams: [
        {
          lender_address: currentAccount,
          pool_id: selectKeyForOpenLoans,
        },
      ],
    },
  )
  useEffect(() => {
    fetchLoansByPool({
      lender_address: currentAccount,
      pool_id: selectKeyForOpenLoans,
    })
  }, [selectKeyForOpenLoans, fetchLoansByPool, currentAccount])

  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setTabKey(() => {
      switch (pathname) {
        // case '/lending/pools':
        //   return 0
        case '/lending/my-pools':
          interceptFn()
          return 0
        case '/lending/loans':
          interceptFn()
          return 1
        default:
          return 0
      }
    })
  }, [pathname, interceptFn])

  // useEffect(() => {
  //   setSearchForActiveCollection('')
  //   setSearchForMyPools('')
  // }, [])

  const myPoolsColumns: ColumnProps[] = [
    {
      title: 'Collection',
      dataIndex: 'collection_info',
      key: 'collection_info',
      align: 'left',
      width: 320,
      render: (_: Record<string, any>, value: any) => {
        const { image_url, name, safelist_request_status } = value
        return (
          <Flex alignItems={'center'} gap={2} w='100%'>
            {/* <Box h={12} w={12} borderRadius={12} bg='pink' /> */}
            <ImageWithFallback
              src={image_url}
              h={12}
              w={12}
              borderRadius={12}
            />
            <Text
              display='inline-block'
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
            >
              {name}
            </Text>
            {safelist_request_status === 'verified' && (
              <SvgComponent svgId='icon-verified-fill' />
            )}
          </Flex>
        )
      },
    },
    // {
    //   title: 'Est. Floor*',
    //   dataIndex: 'col2',
    //   key: 'col2',
    //   align: 'right',
    //   thAlign: 'right',
    //   render: (_: Record<string, any>, value: any) => (
    //     <EthText>{value}</EthText>
    //   ),
    // },
    {
      title: 'TVL (USD)',
      dataIndex: 'pool_amount',
      key: 'pool_amount',
      align: 'right',
      thAlign: 'right',
      render: (_: Record<string, any>, value: any) => (
        <EthText>
          {ethers.utils.formatEther(ethers.BigNumber.from(`${value}`))}
        </EthText>
      ),
    },
    {
      title: 'Collateral Factor',
      dataIndex: 'pool_maximum_percentage',
      key: 'pool_maximum_percentage',
      align: 'center',
      thAlign: 'center',
      render: (_: Record<string, any>, value: any) => (
        <Text>{Number(value) / 100} %</Text>
      ),
    },
    {
      title: 'Tenor',
      dataIndex: 'pool_maximum_days',
      key: 'pool_maximum_days',
      align: 'right',
      thAlign: 'right',
      render: (_: Record<string, any>, value: any) => <Text>{value} days</Text>,
    },
    {
      title: 'Interest',
      dataIndex: 'pool_maximum_interest_rate',
      key: 'pool_maximum_interest_rate',
      render: (_: Record<string, any>, value: any) => (
        <Text>{Number(value) / 100}% APR</Text>
      ),
    },
    {
      title: 'Loans',
      dataIndex: 'loan_count',
      key: 'loan_count',
      align: 'center',
      thAlign: 'center',
    },
    {
      title: '',
      dataIndex: 'pool_id',
      key: 'pool_id',
      align: 'right',
      fixedRight: true,
      thAlign: 'right',
      render: (_: Record<string, any>, value: any) => {
        return (
          <Flex alignItems='center' gap={2}>
            <Text
              color='gray.3'
              onClick={() => {
                navigate('/lending/loans')
                setSelectKeyForOpenLoans(value as number)
              }}
              cursor='pointer'
            >
              Details
            </Text>
            {/* <Link to={`/lending/pools/edit/${id}`}>
              <Text
                color={'blue.1'}
                py={3}
                px={4}
                borderRadius={8}
                bg='white'
              >
                Manage
              </Text>
            </Link> */}
          </Flex>
        )
      },
    },
  ]

  return (
    <>
      <Box my={10}>
        <AllPoolsDescription
          data={{
            img: ImgLend,
            title: 'Lend',
            description:
              'Provide funds to support NFT installment, obtain interest or collateral.',
          }}
        />
      </Box>

      <Tabs
        isLazy
        index={tabKey}
        position='relative'
        onChange={(key) => {
          switch (key) {
            // case 0:
            //   navigate('/lending/pools')
            //   break
            case 0:
              navigate('/lending/my-pools')
              break
            case 1:
              navigate('/lending/loans')
              break

            default:
              break
          }
        }}
      >
        {tabKey === 0 && (
          <Flex position={'absolute'} right={0} top={0} gap={4}>
            {/* {showSearch || isEmpty(activeCollectionData?.list) ? (
              <SearchInput
                value={tabKey === 0 ? activeCollectionSearch : myPoolsSearch}
                onChange={(e) => {
                  if (tabKey === 0) {
                    setSearchForActiveCollection(e.target.value)
                    handleSearchActiveCollections(e.target.value)
                  }
                  if (tabKey === 1) {
                    setSearchForMyPools(e.target.value)
                    handleSearchMyPools(e.target.value)
                  }
                }}
              />
            ) : (
              <Flex
                h='44px'
                w='44px'
                borderRadius={44}
                justify='center'
                alignItems={'center'}
                cursor='pointer'
                onClick={() => setShowSearch(true)}
                _hover={{
                  bg: `var(--chakra-colors-gray-5)`,
                }}
              >
                <ImageWithFallback src={IconSearch} />
              </Flex>
            )} */}
            {!isEmpty(myPoolsData) && (
              <Button
                variant={'secondary'}
                minW='200px'
                onClick={() =>
                  interceptFn(() => navigate('/lending/my-pools/create'))
                }
              >
                + Creative new pool
              </Button>
            )}
          </Flex>
        )}

        <TabList
          _active={{
            color: 'blue.1',
            fontWeight: 'bold',
          }}
        >
          {/* <Tab
            pt={4}
            px={2}
            pb={5}
            _selected={{
              color: 'blue.1',
              borderBottomWidth: 2,
              borderColor: 'blue.1',
            }}
            fontWeight='bold'
          >
            Active Collections
          </Tab> */}
          <Tab
            pt={4}
            px={2}
            pb={5}
            _selected={{
              color: 'blue.1',
              borderBottomWidth: 2,
              borderColor: 'blue.1',
            }}
            fontWeight='bold'
          >
            My Pools&nbsp;
            {!isEmpty(myPoolsData) && (
              <Tag
                bg={'blue.1'}
                color='white'
                borderRadius={15}
                fontSize={'xs'}
                h={5}
              >
                {myPoolsData?.length}
              </Tag>
            )}
          </Tab>
          <Tab
            pt={4}
            px={2}
            pb={5}
            _selected={{
              color: 'blue.1',
              borderBottomWidth: 2,
              borderColor: 'blue.1',
            }}
            fontWeight='bold'
          >
            Open Loans
          </Tab>
        </TabList>

        <TabPanels>
          {/* <TabPanel p={0}>
            <MyTable
              loading={loading1}
              columns={activeCollectionColumns}
              data={activeCollectionData?.list || []}
              caption={() =>
                isEmpty(activeCollectionData?.list) ? (
                  <></>
                ) : (
                  <Pagination
                    total={activeCollectionData?.meta?.total}
                    current={activeCollectionData.meta.current}
                    onChange={(page) => {
                      console.log('aaaaaaaaaaaa')
                      console.log('🚀 ~ file: Lend.tsx:557 ~ Lend ~ page', page)
                      handleFetchActiveCollections()
                    }}
                  />
                )
              }
              onSort={(args) => {
                console.log(args)
                handleFetchActiveCollections()
              }}
              emptyRender={() => {
                return (
                  <EmptyComponent
                    action={() => {
                      return (
                        <Button
                          variant={'secondary'}
                          minW='200px'
                          onClick={() =>
                            interceptFn(() => navigate('/lending/my-pools/create'))
                          }
                        >
                          + Creative new pool
                        </Button>
                      )
                    }}
                  />
                )
              }}
            />
          </TabPanel> */}
          <TabPanel p={0}>
            <MyTable
              loading={myPoolsLoading}
              columns={myPoolsColumns}
              data={myPoolsData || []}
              // onSort={(args: any) => {
              //   console.log(args)
              //   handleFetchMyPools({ address: currentAccount })
              // }}
              emptyRender={() => {
                return (
                  <EmptyComponent
                    action={() => {
                      return (
                        <Button
                          variant={'secondary'}
                          minW='200px'
                          onClick={() =>
                            interceptFn(() =>
                              navigate('/lending/my-pools/create'),
                            )
                          }
                        >
                          + Creative new pool
                        </Button>
                      )
                    }}
                  />
                )
              }}
            />
          </TabPanel>
          <TabPanel p={0}>
            <Flex justify={'space-between'} mt={4} flexWrap='wrap'>
              <Box
                border={`1px solid var(--chakra-colors-gray-2)`}
                borderRadius={12}
                p={6}
                w={{
                  lg: '25%',
                  md: '30%',
                  sm: '100%',
                }}
              >
                <Heading size={'md'} mb={4}>
                  My Collection Pools
                </Heading>
                {/* <SearchInput placeholder='Collections...' /> */}

                <List spacing={4} mt={4} position='relative'>
                  <LoadingComponent loading={myPoolsLoading} />
                  {isEmpty(myPoolsData) && <EmptyComponent />}
                  {!isEmpty(myPoolsData) && (
                    <Flex
                      justify={'space-between'}
                      py={3}
                      px={4}
                      alignItems='center'
                      borderRadius={8}
                      border={`1px solid var(--chakra-colors-gray-2)`}
                      cursor='pointer'
                      onClick={() => setSelectKeyForOpenLoans(undefined)}
                      bg={
                        selectKeyForOpenLoans === undefined ? 'blue.2' : 'white'
                      }
                    >
                      <Text fontSize={'sm'} fontWeight='700'>
                        All my Collections
                      </Text>
                      {!selectKeyForOpenLoans ? (
                        <SvgComponent svgId='icon-checked' />
                      ) : (
                        <Text fontSize={'sm'}>{myPoolsData?.length}</Text>
                      )}
                    </Flex>
                  )}

                  {!isEmpty(myPoolsData) &&
                    myPoolsData.map((item: PoolsListItemType) => (
                      <CollectionListItem
                        data={{
                          contract_addr: item.allow_collateral_contract,
                          image_url: '',
                          name: '',
                          safelist_request_status: 'verified',
                        }}
                        key={item.pool_id}
                        onClick={() => setSelectKeyForOpenLoans(item.pool_id)}
                        isActive={selectKeyForOpenLoans === item.pool_id}
                      />
                    ))}
                </List>
              </Box>
              <Box
                w={{
                  lg: '72%',
                  md: '65%',
                  sm: '100%',
                }}
              >
                <TableList
                  tables={[
                    {
                      tableTitle: () => (
                        <Heading size={'md'} mt={6}>
                          Current Loans as Lender
                        </Heading>
                      ),
                      columns: loansForLendColumns,
                      loading: loansLoading,
                      data: loansData[1],
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
                            Previous Loans as Lender(Paid Off)
                          </Highlight>
                        </Heading>
                      ),
                      columns: loansForLendColumns,
                      data: loansData[2],
                      loading: loansLoading,
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
                            Previous Loans as Lender(Overdue)
                          </Highlight>
                        </Heading>
                      ),
                      columns: loansForLendColumns,
                      data: loansData[3],
                      loading: loansLoading,
                      key: '3',
                    },
                  ]}
                />
              </Box>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </>
  )
}

export default Lend
