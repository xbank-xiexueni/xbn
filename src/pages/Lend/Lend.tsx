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
  Image,
  Heading,
  Tag,
  List,
  useDisclosure,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
// import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  // apiGetActiveCollection,
  apiGetMyPools,
} from '@/api'
import ImgLend from '@/assets/LEND.png'
import {
  ConnectWalletModal,
  // SearchInput,
  // Pagination,
  Table,
  LoadingComponent,
  TableList,
  EmptyTableComponent,
} from '@/components'
import type { ColumnProps } from '@/components/table/Table'
// import { TransactionContext } from '@/context/TransactionContext'
import { TransactionContext } from '@/context/TransactionContext'
import COLORS from '@/utils/Colors'

import IconChecked from '@/assets/icon/icon-checked.svg'
import IconEth from '@/assets/icon/icon-eth.svg'
// import IconSearch from '@/assets/icon/icon-search.svg'

import CollectionListItem from '../buy-nfts/components/CollectionListItem'

import AllPoolsDescription from './components/AllPoolsDescription'
import {
  // activeCollectionColumns,
  loansForLendColumns,
} from './constants'

const Lend = () => {
  const { currentAccount } = useContext(TransactionContext)
  const [tabKey, setTabKey] = useState<0 | 1 | 2>()

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

  const { loading: loading2, run: handleFetchMyPools } = useRequest(
    apiGetMyPools,
    {
      onSuccess: (data: { data: { list: any } }) => {
        setMyPoolsData({
          list: data?.data?.list,
        })
      },
      ready: !!currentAccount && tabKey === 0,
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
  const [allMyPoolsList, setAllMyPoolsList] = useState([])
  const { loading: loading3 } = useRequest(apiGetMyPools, {
    onSuccess: (data: { data: { list: any } }) => {
      setAllMyPoolsList(data?.data?.list)
    },
    ready: !!currentAccount && tabKey === 1,
  })
  // 三个表格的请求

  // -1 代表全选
  const [selectKeyForOpenLoans, setSelectKeyForOpenLoans] = useState(-1)

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

  const column2: ColumnProps[] = [
    {
      title: 'Collection',
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
      title: 'Tenor',
      dataIndex: 'col5',
      key: 'col5',
    },
    {
      title: 'Interest',
      dataIndex: 'col6',
      key: 'col6',
    },
    { title: 'Loans', dataIndex: 'col7', key: 'col7' },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      fixedRight: true,
      thAlign: 'right',
      render: (_, id) => {
        return (
          <Flex alignItems='center' gap={2}>
            <Text
              color={COLORS.secondaryTextColor}
              onClick={() => {
                navigate('/lend/loans')
                setSelectKeyForOpenLoans(id as number)
              }}
              cursor='pointer'
            >
              Details
            </Text>
            {/* <Link to={`/lend/pools/edit/${id}`}>
              <Text
                color={COLORS.primaryColor}
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
                    <Image src={IconEth} height={8} />
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
                  bg: COLORS.secondaryBgc,
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
            color: COLORS.primaryColor,
            fontWeight: 'bold',
          }}
        >
          {/* <Tab
            pt={4}
            px={2}
            pb={5}
            _selected={{
              color: COLORS.primaryColor,
              borderBottomWidth: 2,
              borderColor: COLORS.primaryColor,
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
              color: COLORS.primaryColor,
              borderBottomWidth: 2,
              borderColor: COLORS.primaryColor,
            }}
            fontWeight='bold'
          >
            My Pools&nbsp;
            <Tag
              bg={COLORS.primaryColor}
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
              color: COLORS.primaryColor,
              borderBottomWidth: 2,
              borderColor: COLORS.primaryColor,
            }}
            fontWeight='bold'
          >
            Open Loans
          </Tab>
        </TabList>

        <TabPanels>
          {/* <TabPanel p={0}>
            <Table
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
                  <EmptyTableComponent
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
            <Table
              loading={loading2}
              columns={column2}
              data={myPoolsData?.list || []}
              onSort={(args) => {
                console.log(args)
                handleFetchMyPools()
              }}
              emptyRender={() => {
                return (
                  <EmptyTableComponent
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
                  <LoadingComponent loading={loading3} />
                  <Flex
                    justify={'space-between'}
                    py={3}
                    px={4}
                    alignItems='center'
                    borderRadius={8}
                    border={`1px solid ${COLORS.borderColor}`}
                    cursor='pointer'
                    onClick={() => setSelectKeyForOpenLoans(-1)}
                    bg={
                      selectKeyForOpenLoans === -1
                        ? COLORS.secondaryColor
                        : 'white'
                    }
                  >
                    <Text fontSize={'sm'} fontWeight='700'>
                      All my Collections
                    </Text>
                    {selectKeyForOpenLoans === -1 ? (
                      <Image src={IconChecked} />
                    ) : (
                      <Text fontSize={'sm'}>{myPoolsData.list?.length}</Text>
                    )}
                  </Flex>
                  {allMyPoolsList.map((item: any) => (
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
                      title: 'Current Loans as Lender',
                      // loading: loading,
                      columns: loansForLendColumns,

                      data: [],
                    },
                    {
                      title: 'Previous Loans as Lender(Paid off)',
                      columns: loansForLendColumns,
                      data: [],
                    },
                    {
                      title: 'Previous Loans as Lender(Overdue)',
                      columns: loansForLendColumns,
                      data: [],
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
