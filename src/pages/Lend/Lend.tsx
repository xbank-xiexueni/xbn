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
  Drawer,
  useDisclosure,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import BigNumber from 'bignumber.js'
import { unix } from 'dayjs'
import groupBy from 'lodash-es/groupBy'
import isEmpty from 'lodash-es/isEmpty'
import maxBy from 'lodash-es/maxBy'
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

import type { TabProps } from '@chakra-ui/react'
import type { FunctionComponent } from 'react'

type Dictionary<T> = Record<string, T>

const TabWrapper: FunctionComponent<TabProps> = ({ children, ...rest }) => {
  return (
    <Tab
      pt='14px'
      px='6px'
      pb='20px'
      _selected={{
        color: 'blue.1',
        borderBottomWidth: 2,
        borderColor: 'blue.1',
        w: {
          md: 'auto',
          sm: '200px',
          xs: '200px',
        },
      }}
      display={'inline-block'}
      {...rest}
    >
      <Text fontWeight='bold' noOfLines={1} fontSize='16px'>
        {children}
      </Text>
    </Tab>
  )
}

const Lend = () => {
  const [tabKey, setTabKey] = useState<0 | 1 | 2>(0)

  const {
    isOpen,
    onClose,
    interceptFn,
    currentAccount,
    collectionList,
    collectionLoading,
  } = useWallet()
  const [myPoolsData, setMyPoolsData] = useState<PoolsListItemType[]>([])
  const [allPoolsData, setAllPoolsData] = useState<PoolsListItemType[]>([])
  const { loading: poolsLoading } = useRequest(apiGetPools, {
    onSuccess: ({ data }) => {
      if (isEmpty(data)) return
      setAllPoolsData(data)
      if (!currentAccount) return
      setMyPoolsData(
        data.filter(
          (i) => i.owner_address.toLowerCase() === currentAccount.toLowerCase(),
        ),
      )
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

  const activeCollectionList = useMemo(() => {
    const _list: any[] = []
    collectionList?.forEach(({ contractAddress, nftCollection }) => {
      const currentPools = allPoolsData.filter(
        (item) =>
          item.allow_collateral_contract.toLowerCase() ===
          contractAddress.toLowerCase(),
      )
      const maxAprPoolItem = maxBy(
        currentPools,
        (i) => i.pool_maximum_percentage,
      )
      if (maxAprPoolItem)
        _list.push({
          contractAddress,
          nftCollection,
          ...maxAprPoolItem,
        })
    })
    return _list
  }, [collectionList, allPoolsData])

  const [selectKeyForOpenLoans, setSelectKeyForOpenLoans] = useState<number>()
  // 三个表格的请求
  const [loansData, setLoansData] = useState<Dictionary<LoanListItemType[]>>({
    0: [],
    1: [],
    2: [],
  })
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
  const { data: batchNftListInfo } = useBatchAsset(batchAssetParams)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setTabKey(() => {
      switch (pathname) {
        case '/xlending/lending/collections':
          return 0
        case '/xlending/lending/my-pools':
          interceptFn()
          return 1
        case '/xlending/lending/loans':
          interceptFn()
          return 2
        default:
          return 0
      }
    })
  }, [pathname, interceptFn])

  const activeCollectionColumns: ColumnProps[] = useMemo(() => {
    return [
      {
        title: 'Collection',
        dataIndex: 'nftCollection',
        key: 'contractAddress',
        align: 'left',
        width: 320,
        render: (value: any) => {
          // 后期需要优化
          return (
            <Flex alignItems={'center'} gap={'8px'} w='100%'>
              <ImageWithFallback
                src={value?.imagePreviewUrl}
                boxSize={{
                  md: '42px',
                  sm: '32px',
                  xs: '32px',
                }}
                borderRadius={8}
              />
              <Text
                display='inline-block'
                overflow='hidden'
                whiteSpace='nowrap'
                textOverflow='ellipsis'
              >
                {value?.name || '--'}
              </Text>
              {value?.safelistRequestStatus === 'verified' && (
                <SvgComponent svgId='icon-verified-fill' />
              )}
            </Flex>
          )
        },
      },
      {
        title: 'Est. Floor*',
        dataIndex: 'nftCollection',
        key: 'id',
        align: 'right',
        thAlign: 'right',
        render: (info: any) => {
          // 后期需要优化
          return (
            <Flex alignItems={'center'}>
              <SvgComponent svgId='icon-eth' />
              <Text>{info?.nftCollectionStat?.floorPrice || '--'}</Text>
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
        thAlign: 'right',
        align: 'right',
        render: (value: any) => <Text>{Number(value) / 100}% APR</Text>,
      },
      {
        title: 'Trade',
        dataIndex: 'nftCollection',
        key: 'nftCollection',
        align: 'right',
        fixedRight: true,
        thAlign: 'right',
        render: (value: any, info: any) => {
          return (
            <Flex alignItems='center' gap={'8px'}>
              <Text
                color='blue.1'
                onClick={() => {
                  navigate(`/xlending/lending/pools/create`, {
                    state: {
                      contractAddress: info.contractAddress,
                      nftCollection: value,
                    },
                  })
                }}
                cursor='pointer'
              >
                Supply
              </Text>
            </Flex>
          )
        },
      },
    ]
  }, [navigate])

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
            <Flex alignItems={'center'} gap={'8px'} w='100%'>
              <ImageWithFallback
                src={img}
                boxSize={{
                  md: '42px',
                  sm: '32px',
                  xs: '32px',
                }}
                borderRadius={8}
              />
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
        thAlign: 'right',
        align: 'right',
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
            <Flex alignItems='center' gap={'8px'}>
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
                py='12px'
                px='16px'
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
        key: 'id',
        align: 'left',
        width: 180,
        thAlign: 'left',
        render: (_: any, info: any) => {
          const currentInfo = batchNftListInfo?.find(
            (i) =>
              i?.tokenID === info.nft_collateral_id &&
              i?.assetContractAddress.toLowerCase() ===
                info.nft_collateral_contract.toLowerCase(),
          )
          return (
            <Flex alignItems={'center'} gap={'8px'}>
              <ImageWithFallback
                src={currentInfo?.imagePreviewUrl as string}
                w='40px'
                h='40px'
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
  }, [batchNftListInfo])

  const {
    isOpen: drawVisible,
    onOpen: openDraw,
    onClose: closeDraw,
  } = useDisclosure()

  return (
    <Box mb='100px'>
      <Box
        my={{
          md: '60px',
          sm: '24px',
          xs: '24px',
        }}
      >
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
            case 0:
              navigate('/xlending/lending/collections')
              break
            case 1:
              navigate('/xlending/lending/my-pools')
              break
            case 2:
              navigate('/xlending/lending/loans')
              break

            default:
              break
          }
        }}
      >
        {[0, 1].includes(tabKey) && (
          <Flex
            position={'absolute'}
            right={0}
            top={0}
            gap={'16px'}
            zIndex={3}
            display={{
              md: 'block',
              sm: 'none',
            }}
          >
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
                  interceptFn(() => navigate('/xlending/lending/pools/create'))
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
          top={{ md: '74px', sm: '56px', xs: '56px' }}
          bg='white'
          zIndex={2}
        >
          <TabWrapper>Collections</TabWrapper>
          <TabWrapper>
            My Pools
            {!isEmpty(myPoolsData) && (
              <Tag
                bg={'blue.1'}
                color='white'
                borderRadius={15}
                fontSize='12px'
                w='27px'
                h='20px'
                textAlign={'center'}
                justifyContent='center'
                lineHeight={2}
                fontWeight='700'
                ml='4px'
              >
                {myPoolsData?.length}
              </Tag>
            )}
          </TabWrapper>
          <TabWrapper>Outstanding Loans</TabWrapper>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <MyTable
              loading={poolsLoading || collectionLoading}
              columns={activeCollectionColumns}
              data={activeCollectionList || []}
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
                              navigate('/xlending/lending/pools/create'),
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
            <MyTable
              loading={poolsLoading || collectionLoading}
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
                              navigate('/xlending/lending/pools/create'),
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
            <Flex justify={'space-between'} mt='16px' flexWrap='wrap'>
              <Box
                border={`1px solid var(--chakra-colors-gray-2)`}
                borderRadius={12}
                p={'24px'}
                w={{
                  lg: '25%',
                  md: '30%',
                }}
                display={{
                  md: 'block',
                  sm: 'none',
                  xs: 'none',
                }}
              >
                <Heading mb='16px' fontSize={'16px'}>
                  My Collection Pools
                </Heading>
                {/* <SearchInput placeholder='Collections...' /> */}

                <List spacing='16px' mt='16px' position='relative'>
                  <LoadingComponent
                    loading={poolsLoading || collectionLoading}
                  />
                  {isEmpty(myPoolsData) &&
                    !poolsLoading &&
                    !collectionLoading && <EmptyComponent />}
                  {!isEmpty(myPoolsData) && (
                    <Flex
                      justify={'space-between'}
                      py='12px'
                      px='16px'
                      alignItems='center'
                      borderRadius={8}
                      border={`1px solid var(--chakra-colors-gray-2)`}
                      cursor='pointer'
                      onClick={() => setSelectKeyForOpenLoans(undefined)}
                      bg={
                        selectKeyForOpenLoans === undefined ? 'blue.2' : 'white'
                      }
                    >
                      <Text fontSize='14px' fontWeight='700'>
                        All my Collections
                      </Text>
                      {selectKeyForOpenLoans === undefined ? (
                        <SvgComponent svgId='icon-checked' />
                      ) : (
                        <Text fontSize='14px'>{myPoolsData?.length}</Text>
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
                            data={collection_info}
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
                  xs: '100%',
                }}
              >
                <TableList
                  tables={[
                    {
                      tableTitle: () => (
                        <Heading
                          fontSize={'20px'}
                          mt={{
                            md: '16px',
                            sm: '20px',
                            xs: '20px',
                          }}
                        >
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
                        <Heading
                          fontSize={'20px'}
                          mt={{
                            md: '16px',
                            sm: '40px',
                            xs: '40px',
                          }}
                        >
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
                        <Heading
                          fontSize={'20px'}
                          mt={{
                            md: '16px',
                            sm: '40px',
                            xs: '40px',
                          }}
                        >
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

      {[0, 1].includes(tabKey) && !isEmpty(myPoolsData) && (
        <Flex
          bg='white'
          position={'fixed'}
          bottom={0}
          left={0}
          right={0}
          h='74px'
          display={{ md: 'none', sm: 'flex', xs: 'flex' }}
          alignItems='center'
          justify={'center'}
          zIndex={5}
          px={8}
        >
          <Button
            variant={'primary'}
            w='100%'
            h='42px'
            onClick={() =>
              interceptFn(() => navigate('/xlending/lending/pools/create'))
            }
          >
            + Create New Pool
          </Button>
        </Flex>
      )}

      {tabKey === 1 && (
        <Flex
          bg='white'
          position={'fixed'}
          bottom={0}
          left={0}
          right={0}
          h='74px'
          display={{ md: 'none', sm: 'flex', xs: 'flex' }}
          alignItems='center'
          justify={'center'}
          zIndex={5}
          px={8}
        >
          <Button
            variant={'primary'}
            w='100%'
            h='42px'
            onClick={openDraw}
            leftIcon={<SvgComponent svgId='icon-search' fill={'white'} />}
          >
            My Collection Pools
          </Button>
        </Flex>
      )}
      <Drawer placement={'bottom'} onClose={closeDraw} isOpen={drawVisible}>
        <DrawerOverlay />
        <DrawerContent borderTopRadius={16} pb='40px' h='85vh'>
          <DrawerBody>
            <DrawerCloseButton mt='40px' />
            <Heading fontSize={'24px'} pt='40px' pb='32px'>
              Collections
            </Heading>
            <List spacing={'16px'} position='relative'>
              <LoadingComponent loading={poolsLoading || collectionLoading} />
              {isEmpty(myPoolsData) && !poolsLoading && !collectionLoading && (
                <EmptyComponent />
              )}
              {!isEmpty(myPoolsData) && (
                <Flex
                  justify={'space-between'}
                  py='12px'
                  px='16px'
                  alignItems='center'
                  borderRadius={8}
                  border={`1px solid var(--chakra-colors-gray-2)`}
                  cursor='pointer'
                  onClick={() => setSelectKeyForOpenLoans(undefined)}
                  bg={selectKeyForOpenLoans === undefined ? 'blue.2' : 'white'}
                >
                  <Text fontSize='14px' fontWeight='700'>
                    All my Collections
                  </Text>
                  {selectKeyForOpenLoans === undefined ? (
                    <SvgComponent svgId='icon-checked' />
                  ) : (
                    <Text fontSize='14px'>{myPoolsData?.length}</Text>
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
                        data={collection_info}
                        key={`${pool_id}${allow_collateral_contract}`}
                        onClick={() => setSelectKeyForOpenLoans(pool_id)}
                        isActive={selectKeyForOpenLoans === pool_id}
                        count={loan_count}
                      />
                    )
                  },
                )}
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </Box>
  )
}

export default Lend
