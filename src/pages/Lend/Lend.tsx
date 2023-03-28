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
import useDebounce from 'ahooks/lib/useDebounce'
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
  type ColumnProps,
  SearchInput,
} from '@/components'
import { FORMAT_NUMBER, UNIT } from '@/constants'
import { useWallet, useBatchAsset } from '@/hooks'
import { amortizationCalByDays } from '@/utils/calculation'
import { formatAddress } from '@/utils/format'
import { wei2Eth } from '@/utils/unit-conversion'

import CollectionListItem from '../buy-nfts/components/CollectionListItem'

import AllPoolsDescription from './components/AllPoolsDescription'
import MyPoolActionRender from './components/MyPoolActionRender'

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

  const {
    loading: myPoolsLoading,
    refreshAsync: refreshMyPools,
    data: poolsData,
  } = useRequest(apiGetPools, {
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

  // loan 左侧 搜索 collection
  const [loanCollectionSearchValue, setLoanCollectionSearchValue] = useState('')
  const debounceLoanCollectionSearchValue = useDebounce(
    loanCollectionSearchValue,
    {
      wait: 500,
    },
  )
  // my pools 表格数据
  const poolList = useMemo(() => {
    if (!poolsData?.data) return []
    return poolsData.data?.map((item) => {
      const nftCollection = collectionList.find(
        (i) =>
          i.contractAddress.toLowerCase() ===
          item.allow_collateral_contract.toLowerCase(),
      )?.nftCollection
      return {
        ...item,
        nftCollection,
      }
    })
  }, [poolsData, collectionList])

  // loan 左侧
  const filteredPoolCollectionList = useMemo(() => {
    if (!poolList) return []
    if (!debounceLoanCollectionSearchValue) return poolList || []

    return poolList.filter((item) =>
      item.nftCollection?.name
        .toLocaleLowerCase()
        .includes(debounceLoanCollectionSearchValue.toLocaleLowerCase()),
    )
  }, [poolList, debounceLoanCollectionSearchValue])

  const [loansData, setLoansData] = useState<Dictionary<LoanListItemType[]>>({
    0: [],
    1: [],
    2: [],
  })

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
        dataIndex: 'nftCollection',
        key: 'nftCollection',
        align: 'left',
        width: 240,
        render: (value: any) => {
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
        dataIndex: 'id',
        key: 'id',
        align: 'right',
        thAlign: 'right',
        render: (_: any, info: any) => {
          return (
            <Flex alignItems={'center'}>
              <SvgComponent svgId='icon-eth' />
              <Text>
                {info?.nftCollection?.nftCollectionStat?.floorPrice || '--'}
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
        render: (value: any, info: any) => {
          return (
            <MyPoolActionRender
              data={info}
              onClickDetail={() => setSelectKeyForOpenLoans(value as number)}
              onRefresh={refreshMyPools}
            />
          )
        },
      },
    ]
  }, [refreshMyPools])

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
          const currentInfo = bactNftListInfo?.find(
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
  }, [bactNftListInfo])

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
            {!isEmpty(poolList) && (
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
          top={{ md: '74px', sm: '56px', xs: '56px' }}
          bg='white'
          zIndex={2}
        >
          {/* <Tab
            pt='16px'
            px={'4px'}
            pb={'20px'}
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
            pt={'16px'}
            px={'8px'}
            pb={'20px'}
            _selected={{
              color: 'blue.1',
              borderBottomWidth: 2,
              borderColor: 'blue.1',
            }}
            fontWeight='bold'
            fontSize={'16px'}
          >
            My Pools&nbsp;
            {!isEmpty(poolList) && (
              <Tag
                bg={'blue.1'}
                color='white'
                borderRadius={15}
                fontSize='12px'
                h={'20px'}
                alignItems='center'
                lineHeight={2}
              >
                {poolList?.length}
              </Tag>
            )}
          </Tab>
          <Tab
            pt={'16px'}
            px={'8px'}
            pb={'20px'}
            _selected={{
              color: 'blue.1',
              borderBottomWidth: 2,
              borderColor: 'blue.1',
            }}
            fontWeight='bold'
            fontSize={'16px'}
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
              data={poolList || []}
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
                <SearchInput
                  placeholder='Collections...'
                  value={loanCollectionSearchValue}
                  onChange={(e) => setLoanCollectionSearchValue(e.target.value)}
                />

                <List spacing='16px' mt='16px' position='relative'>
                  <LoadingComponent
                    loading={myPoolsLoading || collectionLoading}
                  />
                  {isEmpty(filteredPoolCollectionList) &&
                    !myPoolsLoading &&
                    !collectionLoading && <EmptyComponent />}
                  {!isEmpty(filteredPoolCollectionList) && (
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
                        All My Collections
                      </Text>
                      {selectKeyForOpenLoans === undefined ? (
                        <SvgComponent svgId='icon-checked' />
                      ) : (
                        <Text fontSize='14px'>
                          {loanDataForNft?.data.length || ''}
                        </Text>
                      )}
                    </Flex>
                  )}

                  {!isEmpty(filteredPoolCollectionList) &&
                    filteredPoolCollectionList.map(
                      ({
                        pool_id,
                        allow_collateral_contract,
                        loan_count,
                        nftCollection,
                      }) => {
                        return (
                          <CollectionListItem
                            data={{
                              nftCollection,
                              contractAddress: allow_collateral_contract,
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

      {tabKey === 0 && !isEmpty(poolList) && (
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
              interceptFn(() => navigate('/xlending/lending/my-pools/create'))
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
            <Heading fontSize={'24px'} pt='40px' pb='32px' mb='16px'>
              My Collection Pools
            </Heading>
            <SearchInput
              placeholder='Collections...'
              value={loanCollectionSearchValue}
              onChange={(e) => setLoanCollectionSearchValue(e.target.value)}
            />
            <List spacing={'16px'} position='relative' mt='16px'>
              <LoadingComponent
                loading={myPoolsLoading || collectionLoading}
                top='4px'
                borderRadius={8}
              />
              {isEmpty(filteredPoolCollectionList) &&
                !myPoolsLoading &&
                !collectionLoading && <EmptyComponent />}
              {!isEmpty(filteredPoolCollectionList) && (
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
                    All My Collections
                  </Text>

                  {selectKeyForOpenLoans === undefined ? (
                    <SvgComponent svgId='icon-checked' />
                  ) : (
                    <Text fontSize='14px'>
                      {loanDataForNft?.data.length || ''}
                    </Text>
                  )}
                </Flex>
              )}

              {!isEmpty(filteredPoolCollectionList) &&
                filteredPoolCollectionList.map(
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
