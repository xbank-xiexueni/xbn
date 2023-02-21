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
  Image,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
// import debounce from 'lodash-es/debounce'
import groupBy from 'lodash-es/groupBy'
import isEmpty from 'lodash-es/isEmpty'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  apiGetLpLoans,
  // apiGetActiveCollection,
  apiGetMyPools,
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
  const [myPoolsData, setMyPoolsData] = useState({
    list: [],
  })

  const { loading: myPoolsLoading, run: handleFetchMyPools } = useRequest(
    apiGetMyPools,
    {
      onSuccess: (data: { data: { list: any } }) => {
        setMyPoolsData({
          list: data?.data?.list,
        })
      },
      ready: !!currentAccount,
      debounceWait: 100,
    },
  )
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
  // const { loading: loading3 } = useRequest(apiGetMyPools, {
  //   onSuccess: (data: { data: { list: any } }) => {
  //     setAllMyPoolsList(data?.data?.list)
  //   },
  //   ready: !!currentAccount && tabKey === 1,
  // })
  // 三个表格的请求
  const [loansData, setLoansData] = useState<{
    data: Dictionary<any[]>
  }>({
    data: {
      1: [],
      2: [],
      3: [],
    },
  })

  // -1 代表全选
  const [selectKeyForOpenLoans, setSelectKeyForOpenLoans] = useState(-1)
  const fetchLoans = useMemo(() => {
    return apiGetLpLoans
  }, [])
  const { loading: loansLoading } = useRequest(fetchLoans, {
    onSuccess: (data) => {
      setLoansData({
        data: groupBy(data.data.list, 'status'),
      })
    },
    ready: tabKey === 1 && !!currentAccount,
    refreshDeps: [selectKeyForOpenLoans],
  })

  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setTabKey(() => {
      switch (pathname) {
        // case '/lend/pools':
        //   return 0
        case '/lend/my-pools':
          interceptFn()
          return 0
        case '/lend/loans':
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
      dataIndex: 'col1',
      key: 'col1',
      align: 'left',
      width: 320,
      render: (
        _: Record<string, string | number | boolean>,
        value: string | number | boolean,
      ) => {
        const isVerified = true
        return (
          <Flex alignItems={'center'} gap={2} w='100%'>
            <Image src={_.img as string} h={12} w={12} borderRadius={12} />
            <Text
              display='inline-block'
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
            >
              {value}
            </Text>
            {isVerified && <SvgComponent svgId='icon-verified-fill' />}
          </Flex>
        )
      },
    },
    {
      title: 'Est. Floor*',
      dataIndex: 'col2',
      key: 'col2',
      align: 'right',
      thAlign: 'right',
      render: (
        _: Record<string, string | number | boolean>,
        value: string | number | boolean,
      ) => <EthText>{value}</EthText>,
    },
    {
      title: 'TVL (USD)',
      dataIndex: 'col3',
      key: 'col3',
      align: 'right',
      thAlign: 'right',
      render: (
        _: Record<string, string | number | boolean>,
        value: string | number | boolean,
      ) => <EthText>{value}</EthText>,
      // sortable: true,
    },
    {
      title: 'Collateral Factor',
      dataIndex: 'col4',
      key: 'col4',
      align: 'center',
      thAlign: 'center',
      render: (
        _: Record<string, string | number | boolean>,
        value: string | number | boolean,
      ) => <Text>{value} %</Text>,
    },
    {
      title: 'Tenor',
      dataIndex: 'col5',
      key: 'col5',
      align: 'right',
      thAlign: 'right',
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
        _: Record<string, string | number | boolean>,
        value: string | number | boolean,
      ) => <Text>{value}% APR</Text>,
    },
    {
      title: 'Loans',
      dataIndex: 'col7',
      key: 'col7',
      align: 'center',
      thAlign: 'center',
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      fixedRight: true,
      thAlign: 'right',
      render: (
        _: Record<string, string | number | boolean>,
        value: string | number | boolean,
      ) => {
        return (
          <Flex alignItems='center' gap={2}>
            <Text
              color='gray.3'
              onClick={() => {
                navigate('/lend/loans')
                setSelectKeyForOpenLoans(value as number)
              }}
              cursor='pointer'
            >
              Details
            </Text>
            {/* <Link to={`/lend/pools/edit/${id}`}>
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
      {/* <Button isDisabled>调用啦</Button> */}
      <Box my={10}>
        <AllPoolsDescription
          data={{
            img: ImgLend,
            title: 'Lend',
            description:
              'Provide funds to support NFT installment, obtain interest or collateral.',
            keys: [
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
            //   navigate('/lend/pools')
            //   break
            case 0:
              navigate('/lend/my-pools')
              break
            case 1:
              navigate('/lend/loans')
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
                <Image src={IconSearch} />
              </Flex>
            )} */}
            {!isEmpty(myPoolsData?.list) && (
              <Button
                variant={'secondary'}
                minW='200px'
                onClick={() =>
                  interceptFn(() => navigate('/lend/my-pools/create'))
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
            <Tag
              bg={'blue.1'}
              color='white'
              borderRadius={15}
              fontSize={'xs'}
              h={5}
            >
              {myPoolsData?.list?.length}
            </Tag>
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
                            interceptFn(() => navigate('/lend/my-pools/create'))
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
              data={myPoolsData?.list || []}
              onSort={(args: any) => {
                console.log(args)
                handleFetchMyPools()
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
                            interceptFn(() => navigate('/lend/my-pools/create'))
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
                  My Collection Pools
                </Heading>
                {/* <SearchInput placeholder='Collections...' /> */}

                <List spacing={4} mt={4} position='relative'>
                  <LoadingComponent loading={myPoolsLoading} />
                  {isEmpty(myPoolsData.list) && <EmptyComponent />}
                  {!isEmpty(myPoolsData.list) && (
                    <Flex
                      justify={'space-between'}
                      py={3}
                      px={4}
                      alignItems='center'
                      borderRadius={8}
                      border={`1px solid var(--chakra-colors-gray-2)`}
                      cursor='pointer'
                      onClick={() => setSelectKeyForOpenLoans(-1)}
                      bg={selectKeyForOpenLoans === -1 ? 'blue.2' : 'white'}
                    >
                      <Text fontSize={'sm'} fontWeight='700'>
                        All my Collections
                      </Text>
                      {selectKeyForOpenLoans === -1 ? (
                        <SvgComponent svgId='icon-checked' />
                      ) : (
                        <Text fontSize={'sm'}>{myPoolsData.list?.length}</Text>
                      )}
                    </Flex>
                  )}

                  {!isEmpty(myPoolsData.list) &&
                    myPoolsData.list.map((item: any) => (
                      <CollectionListItem
                        data={{ ...item }}
                        key={JSON.stringify(item)}
                        onClick={() => setSelectKeyForOpenLoans(item.id)}
                        isActive={selectKeyForOpenLoans === item.id}
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
                          Current Loans as Lender
                        </Heading>
                      ),
                      columns: loansForLendColumns,
                      loading: loansLoading,
                      data: loansData?.data[1],
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
                      data: loansData?.data[2],
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
                      data: loansData?.data[3],
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
