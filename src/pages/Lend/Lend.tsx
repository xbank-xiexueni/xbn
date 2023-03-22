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
import BigNumber from 'bignumber.js'
import { unix } from 'dayjs'
import groupBy from 'lodash-es/groupBy'
import isEmpty from 'lodash-es/isEmpty'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { apiGetLoans, apiGetPools } from '@/api'
import ImgLend from '@/assets/LEND.png'
import {
  ConnectWalletModal,
  MyTable,
  LoadingComponent,
  TableList,
  EmptyComponent,
  SvgComponent,
  EthText,
  ImageWithFallback,
} from '@/components'
import type { ColumnProps } from '@/components/my-table'
import { FORMAT_NUMBER, UNIT } from '@/constants'
import { useWallet, useBatchAsset } from '@/hooks'
import { amortizationCalByDays } from '@/utils/calculation'
import { formatAddress } from '@/utils/format'
import { wei2Eth } from '@/utils/unit-conversion'

import CollectionListItem from '../buy-nfts/components/CollectionListItem'

import AllPoolsDescription from './components/AllPoolsDescription'

type Dictionary<T> = Record<string, T>

const Lend = () => {
  const [tabKey, setTabKey] = useState<0 | 1 | 2>()

  const {
    isOpen,
    onClose,
    interceptFn,
    currentAccount,
    collectionList,
    collectionLoading,
  } = useWallet()

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
  const [loansData, setLoansData] = useState<Dictionary<LoanListItemType[]>>({
    0: [],
    1: [],
    2: [],
  })

  // -1 代表全选
  const [selectKeyForOpenLoans, setSelectKeyForOpenLoans] = useState<number>()

  const { loading: loansLoading, data: loanDataForNft } = useRequest(
    () =>
      apiGetLoans({
        lender_address: currentAccount,
        pool_id: selectKeyForOpenLoans,
      }),
    {
      onSuccess: async ({ data }) => {
        setLoansData(groupBy(data, 'loan_status'))
      },
      ready: tabKey === 1 && !!currentAccount,
      refreshDeps: [selectKeyForOpenLoans, currentAccount],
      debounceWait: 100,
    },
  )

  const batchAssetParams = useMemo(() => {
    if (!loanDataForNft) return []
    return loanDataForNft?.data?.map((i) => ({
      assetContractAddress: i.nft_collateral_contract,
      assetTokenId: i.nft_collateral_id,
    }))
  }, [loanDataForNft])
  const { data: bactNftListInfo } = useBatchAsset(batchAssetParams)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setTabKey(() => {
      switch (pathname) {
        // case '/lending/pools':
        //   return 0
        case '/xlending/lending/my-pools':
          interceptFn()
          return 0
        case '/xlending/lending/loans':
          interceptFn()
          return 1
        default:
          return 0
      }
    })
  }, [pathname, interceptFn])

  const myPoolsColumns: ColumnProps[] = useMemo(() => {
    return [
      {
        title: 'Collection',
        dataIndex: 'allow_collateral_contract',
        key: 'allow_collateral_contract',
        align: 'left',
        width: 320,
        render: (value: any) => {
          // 后期需要优化
          let img = '',
            name = '',
            safelistRequestStatus = ''
          const currentInfo = collectionList.find(
            (i) => i.contractAddress.toLowerCase() === value.toLowerCase(),
          )
          if (currentInfo?.nftCollection) {
            img = currentInfo?.nftCollection?.imagePreviewUrl
            name = currentInfo?.nftCollection?.name
            safelistRequestStatus =
              currentInfo?.nftCollection?.safelistRequestStatus
          }

          return (
            <Flex alignItems={'center'} gap={2} w='100%'>
              {/* <Box h={12} w={12} borderRadius={12} bg='pink' /> */}
              <ImageWithFallback src={img} h={12} w={12} borderRadius={12} />
              <Text
                display='inline-block'
                overflow='hidden'
                whiteSpace='nowrap'
                textOverflow='ellipsis'
              >
                {name || '--'}
              </Text>
              {safelistRequestStatus === 'verified' && (
                <SvgComponent svgId='icon-verified-fill' />
              )}
            </Flex>
          )
        },
      },
      {
        title: 'Est. Floor*',
        dataIndex: 'id',
        key: 'id',
        align: 'right',
        thAlign: 'right',
        render: (_: any, info: any) => {
          // 后期需要优化
          const currentInfo = collectionList.find(
            (i) =>
              i.contractAddress.toLowerCase() ===
              info.allow_collateral_contract.toLowerCase(),
          )

          return (
            <Flex alignItems={'center'}>
              <SvgComponent svgId='icon-eth' />
              <Text>
                {currentInfo?.nftCollection?.nftCollectionStat?.floorPrice ||
                  '--'}
              </Text>
            </Flex>
          )
        },
      },
      {
        title: 'TVL',
        dataIndex: 'pool_amount',
        key: 'pool_amount',
        align: 'right',
        thAlign: 'right',
        render: (value: any) => <EthText>{wei2Eth(value)}</EthText>,
      },
      {
        title: 'Collateral Factor',
        dataIndex: 'pool_maximum_percentage',
        key: 'pool_maximum_percentage',
        align: 'center',
        thAlign: 'center',
        render: (value: any) => <Text>{Number(value) / 100} %</Text>,
      },
      {
        title: 'Duration',
        dataIndex: 'pool_maximum_days',
        key: 'pool_maximum_days',
        align: 'right',
        thAlign: 'right',
        render: (value: any) => <Text>{value} days</Text>,
      },
      {
        title: 'Interest',
        dataIndex: 'pool_maximum_interest_rate',
        key: 'pool_maximum_interest_rate',
        render: (value: any) => <Text>{Number(value) / 100}% APR</Text>,
      },
      {
        title: 'Supporting Loans',
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
        render: (value: any) => {
          return (
            <Flex alignItems='center' gap={2}>
              <Text
                color='gray.3'
                onClick={() => {
                  navigate('/xlending/lending/loans')
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
  }, [collectionList, navigate])

  const loansForLendColumns: ColumnProps[] = useMemo(() => {
    return [
      {
        title: 'Asset',
        dataIndex: 'id',
        key: 'od',
        align: 'left',
        width: 180,
        render: (_: any, info: any) => {
          const currentInfo = bactNftListInfo?.find(
            (i) =>
              i?.tokenID === info.nft_collateral_id &&
              i?.assetContractAddress.toLowerCase() ===
                info.nft_collateral_contract.toLowerCase(),
          )
          return (
            <Flex alignItems={'center'} gap={2}>
              <ImageWithFallback
                src={currentInfo?.imagePreviewUrl as string}
                w={10}
                h={10}
                borderRadius={4}
              />
              <Text
                w={'60%'}
                display='inline-block'
                overflow='hidden'
                whiteSpace='nowrap'
                textOverflow='ellipsis'
              >
                {currentInfo
                  ? currentInfo?.name || `#${currentInfo?.tokenID}`
                  : '--'}
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
        render: (value: any) => <Text>{unix(value).format('YYYY/MM/DD')}</Text>,
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
                  .minus(data.total_repayment),
              ),
            ).toFormat(FORMAT_NUMBER)}
            &nbsp; ETH
          </Text>
        ),
      },
    ]
  }, [bactNftListInfo])

  return (
    <>
      <Box my={10}>
        <AllPoolsDescription
          data={{
            img: ImgLend,
            title: 'Lend',
            description:
              'Provide funds to support NFT Buy Now Pay Later, \nreceive interests or discounts on NFTs as collateral.',
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
              navigate('/xlending/lending/my-pools')
              break
            case 1:
              navigate('/xlending/lending/loans')
              break

            default:
              break
          }
        }}
      >
        {tabKey === 0 && (
          <Flex position={'absolute'} right={0} top={0} gap={4} zIndex={3}>
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
                  interceptFn(() =>
                    navigate('/xlending/lending/my-pools/create'),
                  )
                }
              >
                + Create New Pool
              </Button>
            )}
          </Flex>
        )}

        <TabList
          _active={{
            color: 'blue.1',
            fontWeight: 'bold',
          }}
          position='sticky'
          top={'74px'}
          bg='white'
          zIndex={2}
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
                alignItems='center'
                lineHeight={2}
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
            Outstanding Loans
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
                          + Create new pool
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
              loading={myPoolsLoading || collectionLoading}
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
                              navigate('/xlending/lending/my-pools/create'),
                            )
                          }
                        >
                          + Create New Pool
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
                  <LoadingComponent
                    loading={myPoolsLoading || collectionLoading}
                  />
                  {isEmpty(myPoolsData) &&
                    !myPoolsLoading &&
                    !collectionLoading && <EmptyComponent />}
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
                      {selectKeyForOpenLoans === undefined ? (
                        <SvgComponent svgId='icon-checked' />
                      ) : (
                        <Text fontSize={'sm'}>{myPoolsData?.length}</Text>
                      )}
                    </Flex>
                  )}

                  {!isEmpty(myPoolsData) &&
                    myPoolsData.map(
                      ({
                        pool_id,
                        allow_collateral_contract,
                        loan_count,
                      }: PoolsListItemType) => {
                        const collection_info = collectionList?.find(
                          (i) =>
                            i.contractAddress.toLowerCase() ===
                            allow_collateral_contract.toLowerCase(),
                        )
                        return (
                          <CollectionListItem
                            data={{
                              contractAddress: collection_info?.contractAddress,
                              ...collection_info?.nftCollection,
                            }}
                            key={`${pool_id}${allow_collateral_contract}`}
                            onClick={() => setSelectKeyForOpenLoans(pool_id)}
                            isActive={selectKeyForOpenLoans === pool_id}
                            count={loan_count}
                          />
                        )
                      },
                    )}
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
                      data: loansData[0],
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
                      data: loansData[1],
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
                      data: loansData[2],
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
