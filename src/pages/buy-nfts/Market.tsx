import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  GridItem,
  Heading,
  List,
  Menu,
  MenuButton,
  MenuList,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import useDebounce from 'ahooks/lib/useDebounce'
import useInfiniteScroll from 'ahooks/lib/useInfiniteScroll'
import useRequest from 'ahooks/lib/useRequest'
import filter from 'lodash-es/filter'
import isEmpty from 'lodash-es/isEmpty'
import maxBy from 'lodash-es/maxBy'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { apiGetPools } from '@/api'
import {
  ConnectWalletModal,
  EmptyComponent,
  LoadingComponent,
  MarketNftListCard,
  SearchInput,
  Select,
  SvgComponent,
  // Select
} from '@/components'
import type { NftAsset, NftCollection } from '@/hooks'
import {
  useIsMobile,
  NftAssetStatus,
  useNftCollectionSearchAssetLazyQuery,
  NftAssetOrderByField,
  OrderDirection,
  useNftCollectionAssetsLazyQuery,
  useWallet,
  useNftCollectionsByContractAddressesQuery,
  useScrollMore,
} from '@/hooks'

import CollectionDescription from './components/CollectionDescription'
import CollectionListItem from './components/CollectionListItem'

const SORT_OPTIONS = [
  {
    label: 'Price: low to high',
    value: {
      direction: OrderDirection.Asc,
      field: NftAssetOrderByField.Price,
    },
  },
  {
    label: 'Price: high to low',
    value: {
      direction: OrderDirection.Desc,
      field: NftAssetOrderByField.Price,
    },
  },
  {
    label: 'Recent Created',
    value: {
      direction: OrderDirection.Desc,
      field: NftAssetOrderByField.CreatedAt,
    },
  },
]

const Market = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const { isOpen, onClose, interceptFn } = useWallet()
  const {
    isOpen: drawVisible,
    onOpen: openDraw,
    onClose: closeDraw,
  } = useDisclosure()
  const [selectCollection, setSelectCollection] = useState<{
    contractAddress: string
    nftCollection: NftCollection
  }>()
  const [assetSearchValue, setAssetSearchValue] = useState('')
  const debounceSearchValue = useDebounce(assetSearchValue, { wait: 500 })
  const [collectionSearchValue, setCollectionSearchValue] = useState('')
  const debounceCollectionSearchValue = useDebounce(collectionSearchValue, {
    wait: 500,
  })
  const [orderOption, setOrderOption] = useState(SORT_OPTIONS[0])

  const [poolsMap, setPoolsMap] = useState<Map<string, PoolsListItemType[]>>()

  const { loading: poolsLoading } = useRequest(() => apiGetPools({}), {
    onSuccess: (data) => {
      if (isEmpty(data)) {
        return
      }
      const newMap = new Map()
      data.forEach((item) => {
        const lowercaseAddress = item.allow_collateral_contract.toLowerCase()
        const prev = newMap.get(lowercaseAddress)
        if (prev) {
          newMap.set(lowercaseAddress, [...prev, item])
        } else {
          newMap.set(lowercaseAddress, [item])
        }
      })

      setPoolsMap(newMap)
    },
    debounceWait: 100,
  })

  const collectionWithPoolsIds = useMemo(
    () => (poolsMap ? [...poolsMap.keys()] : []),
    [poolsMap],
  )

  const { data: collectionData, loading: collectionLoading } =
    useNftCollectionsByContractAddressesQuery({
      variables: {
        assetContractAddresses: collectionWithPoolsIds,
      },
      skip: isEmpty(collectionWithPoolsIds),
      onCompleted(data) {
        if (
          !data ||
          !data?.nftCollectionsByContractAddresses ||
          isEmpty(data?.nftCollectionsByContractAddresses)
        ) {
          return
        }

        const prevCollectionId = Object.fromEntries(
          new URLSearchParams(search),
        )?.collectionId
        const prevItem = data.nftCollectionsByContractAddresses.find(
          (i) => i.nftCollection.id === prevCollectionId,
        )

        setSelectCollection(
          prevItem || data.nftCollectionsByContractAddresses[0],
        )
      },
    })

  const highestRate = useMemo(() => {
    if (!poolsMap || isEmpty(poolsMap) || !selectCollection) return undefined
    const currentPools = poolsMap.get(selectCollection.contractAddress)

    const maxRate = maxBy(
      currentPools,
      ({ pool_maximum_percentage }) => pool_maximum_percentage,
    )?.pool_maximum_percentage
    if (!maxRate) {
      return undefined
    }
    return maxRate
  }, [poolsMap, selectCollection])

  useEffect(() => {
    if (!selectCollection) return
    const {
      nftCollection: { id },
    } = selectCollection
    navigate(`/xlending/buy-nfts/market?collectionId=${id}`)
  }, [selectCollection, navigate])

  // 根据 collectionId 搜索 assets
  const [fetchAssetByCollectionId] = useNftCollectionAssetsLazyQuery({
    fetchPolicy: 'network-only',
  })

  const getLoadMoreList = useCallback(
    async (after: string | null, first: number) => {
      if (!selectCollection?.nftCollection?.id || !fetchAssetByCollectionId)
        return {
          list: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        }
      const { data } = await fetchAssetByCollectionId({
        variables: {
          collectionId: `${selectCollection?.nftCollection?.id}`,
          orderBy: orderOption.value,
          where: {
            status: [NftAssetStatus.BuyNow],
          },
          first,
          after,
        },
      })

      return {
        list: data?.nftCollectionAssets.edges || [],
        pageInfo: data?.nftCollectionAssets.pageInfo,
      }
    },
    [fetchAssetByCollectionId, selectCollection, orderOption],
  )

  const {
    data: assetsData,
    loading: assetLoading,
    // loadMore,
    loadingMore: assetLoadingMore,
    noMore,
    loadMore,
  } = useInfiniteScroll(
    (item) =>
      getLoadMoreList(item?.pageInfo?.endCursor, item?.list.length || 12),
    {
      // target: ref,
      isNoMore: (item) => !item?.pageInfo?.hasNextPage,
      reloadDeps: [selectCollection?.nftCollection?.id, orderOption],
      // threshold: 10,
      manual: true,
    },
  )

  const filteredCollectionList = useMemo(() => {
    if (!collectionData) return
    const { nftCollectionsByContractAddresses } = collectionData
    if (!debounceCollectionSearchValue)
      return nftCollectionsByContractAddresses || []
    return filter(nftCollectionsByContractAddresses, (item) =>
      item.nftCollection.name
        .toLocaleLowerCase()
        .includes(debounceCollectionSearchValue.toLocaleLowerCase()),
    )
  }, [collectionData, debounceCollectionSearchValue])

  const [fetchAssetBySearch, { loading: fetchAssetBySearchLoading }] =
    useNftCollectionSearchAssetLazyQuery()
  const [searchedAsset, setSearchedAsset] = useState<NftAsset>()

  useEffect(() => {
    if (!debounceSearchValue || !fetchAssetBySearch || !selectCollection) {
      return setSearchedAsset(undefined)
    }
    fetchAssetBySearch({
      variables: {
        collectionId: selectCollection?.nftCollection?.id,
        search: debounceSearchValue,
      },
    })
      .then(({ data }) => {
        setSearchedAsset(data?.nftCollectionSearchAsset)
      })
      .catch(() => {
        setSearchedAsset(undefined)
      })
  }, [debounceSearchValue, fetchAssetBySearch, selectCollection])

  // grid
  const [grid, setGrid] = useState(4)

  const responsiveSpan = useMemo(
    () => ({
      xl: grid,
      lg: grid,
      md: grid,
      sm: 2,
      xs: 1,
    }),
    [grid],
  )

  const isH5 = useIsMobile()
  const { isMoreThan } = useScrollMore({
    screenCount: 2,
    options: {
      isReady: isH5,
    },
  })

  return (
    <>
      <Box
        mb={{ md: '40px', sm: '12px', xs: '12px' }}
        mt={{
          md: '60px',
          sm: '16px',
          xs: '16px',
        }}
      >
        <Heading fontSize={{ md: '48px', sm: '24px', xs: '24px' }}>
          Buy NFTs
        </Heading>
      </Box>

      <Flex
        mt={'10px'}
        flexWrap={{ lg: 'nowrap', md: 'wrap', sm: 'wrap', xs: 'wrap' }}
        gap={9}
      >
        <Box
          borderColor='gray.2'
          borderWidth={{ md: 1, sm: 0, xs: 0 }}
          borderRadius={{ md: '12px', sm: 0, xs: 0 }}
          pt={{ md: '24px', sm: '20px', xs: '20px' }}
          px={{ md: '24px', sm: 0, xs: 0 }}
          w={{
            xl: '360px',
            lg: '260px',
            md: '100%',
            sm: '100%',
            xs: '100%',
          }}
          height={{
            xl: '70vh',
            lg: '70vh',
          }}
          overflowY='auto'
          overflowX={'visible'}
          position={{
            md: 'sticky',
            sm: 'static',
            xs: 'static',
          }}
          top={'100px'}
          bg='white'
          zIndex={2}
        >
          <Heading size={'md'} mb='16px'>
            Collections
          </Heading>
          {/* pc collection list */}
          <Box
            display={{
              md: 'block',
              sm: 'none',
              xs: 'none',
            }}
            pb='40px'
          >
            <SearchInput
              placeholder='Collections...'
              isDisabled={collectionLoading || poolsLoading}
              value={collectionSearchValue}
              onChange={(e) => {
                setCollectionSearchValue(e.target.value)
              }}
            />

            {/* pc 端 */}
            <List
              spacing='16px'
              mt='16px'
              position='relative'
              display={{
                md: 'block',
                sm: 'none',
                xs: 'none',
              }}
            >
              <LoadingComponent
                loading={collectionLoading || poolsLoading}
                top={0}
              />
              {filteredCollectionList &&
                isEmpty(filteredCollectionList) &&
                !collectionLoading && <EmptyComponent />}

              {filteredCollectionList?.map((item) => (
                <CollectionListItem
                  data={item}
                  key={`${item?.nftCollection?.id}${item?.contractAddress}`}
                  onClick={() => {
                    setSelectCollection(item)
                    setOrderOption(SORT_OPTIONS[0])
                    setAssetSearchValue('')
                    setCollectionSearchValue('')
                  }}
                  count={item.nftCollection.assetsCount}
                  isActive={
                    selectCollection?.nftCollection?.id ===
                    item?.nftCollection?.id
                  }
                  iconSize='26px'
                />
              ))}
            </List>
          </Box>
          {/* 移动端  collection list*/}
          <Box
            display={{
              md: 'none',
              sm: 'block',
              xs: 'block',
            }}
            mt={'16px'}
            position='relative'
          >
            <CollectionListItem
              isActive
              data={selectCollection}
              rightIconId='icon-arrow-down'
              onClick={openDraw}
            />
            <Divider mt='16px' />
            <Drawer
              placement={'bottom'}
              onClose={closeDraw}
              isOpen={drawVisible}
            >
              <DrawerOverlay />
              <DrawerContent borderTopRadius={16} pb='40px'>
                <DrawerBody>
                  <Heading fontSize={'24px'} pt='40px' pb='32px'>
                    Collections
                  </Heading>
                  <SearchInput
                    placeholder='Collections...'
                    value={collectionSearchValue}
                    onChange={(e) => {
                      setCollectionSearchValue(e.target.value)
                    }}
                  />
                  <List spacing='16px' mt='16px' position='relative'>
                    <LoadingComponent
                      loading={collectionLoading || poolsLoading}
                      top={0}
                    />
                    {filteredCollectionList &&
                      isEmpty(filteredCollectionList) &&
                      !collectionLoading && <EmptyComponent />}

                    {filteredCollectionList?.map((item) => (
                      <CollectionListItem
                        data={item}
                        key={`${item?.nftCollection?.id}${item?.contractAddress}`}
                        onClick={() => {
                          setSelectCollection(item)
                          setOrderOption(SORT_OPTIONS[0])
                          setAssetSearchValue('')
                          setCollectionSearchValue('')
                          closeDraw()
                        }}
                        count={item.nftCollection.assetsCount}
                        isActive={
                          selectCollection?.nftCollection?.id ===
                          item?.nftCollection?.id
                        }
                        iconSize='26px'
                      />
                    ))}
                  </List>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Box>
        </Box>

        <Box
          w={{
            xl: '980px',
            lg: '640px',
            md: '100%',
            sm: '100%',
            xs: '100%',
          }}
        >
          <CollectionDescription
            loading={collectionLoading || poolsLoading}
            data={selectCollection?.nftCollection}
            highestRate={highestRate}
          />
          {collectionLoading || poolsLoading ? (
            <Skeleton height={16} borderRadius={16} mb='24px' />
          ) : (
            <Flex
              justify={'space-between'}
              mb='16px'
              pb='8px'
              alignItems='center'
              gap={{ md: 0, sm: '10px', xs: '10px' }}
              position='sticky'
              top={{
                md: '76px',
                sm: isMoreThan ? '2px' : '56px',
                xs: isMoreThan ? '2px' : '56px',
              }}
              zIndex={20}
              bg='white'
              pt={'25px'}
              transition='all 0.15s'
            >
              <Box
                w={{
                  xl: '55%',
                  lg: '44%',
                  md: '50%',
                  sm: '90%',
                  xs: '90%',
                }}
              >
                <SearchInput
                  placeholder={'Search...'}
                  value={assetSearchValue}
                  onChange={(e) => {
                    setAssetSearchValue(e.target.value)
                  }}
                />
              </Box>
              {/* pc 端 排序 & grid */}
              <Flex
                alignItems={'center'}
                gap={'20px'}
                display={{
                  xl: 'flex',
                  lg: 'flex',
                  md: 'flex',
                  sm: 'none',
                  xs: 'none',
                }}
              >
                <Select
                  options={SORT_OPTIONS}
                  value={orderOption}
                  defaultValue={SORT_OPTIONS[0]}
                  onChange={(target) => {
                    if (!target) return
                    setOrderOption(target)
                  }}
                  borderColor={'var(--chakra-colors-gray-2)'}
                />
                <Flex borderColor={'gray.2'} borderWidth={1} borderRadius={8}>
                  {[4, 3].map((item, i) => (
                    <Flex
                      p='14px'
                      bg={grid === item ? 'gray.5' : 'white'}
                      onClick={() => setGrid(item)}
                      cursor='pointer'
                      key={item}
                      borderLeftRadius={i === 0 ? 8 : 0}
                      borderRightRadius={i === 1 ? 8 : 0}
                    >
                      <SvgComponent
                        svgId={`icon-grid-${item === 4 ? 'large' : 'middle'}`}
                        fill={`var(--chakra-colors-${
                          grid === item ? 'blue' : 'gray'
                        }-1)`}
                      />
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              {/* mobile 排序 */}
              <Menu closeOnBlur={false} placement='bottom-end'>
                {({ isOpen: visible }) => (
                  <>
                    <MenuButton
                      display={{
                        md: 'none',
                        sm: 'block',
                        xs: 'block',
                      }}
                    >
                      <Flex
                        alignItems={'center'}
                        justifyContent='center'
                        borderColor={visible ? 'blue.1' : 'gray.1'}
                        borderWidth='1px'
                        w='42px'
                        h='42px'
                        borderRadius={'50%'}
                      >
                        <SvgComponent
                          svgId='icon-sort-label'
                          color={visible ? 'blue.1' : 'black.1'}
                        />
                      </Flex>
                    </MenuButton>
                    <MenuList>
                      <Flex flexDir={'column'} fontWeight={'500'} gap='8px'>
                        {SORT_OPTIONS.map(({ label, value }) => (
                          <Flex
                            key={label}
                            px='9px'
                            py='8px'
                            borderRadius={4}
                            bg={
                              orderOption.label === label ? 'gray.5' : 'white'
                            }
                            onClick={() => {
                              if (orderOption.label === label) return
                              setOrderOption({ label, value })
                            }}
                          >
                            {label}
                          </Flex>
                        ))}
                      </Flex>
                    </MenuList>
                  </>
                )}
              </Menu>
            </Flex>
          )}

          {!debounceSearchValue && (
            <SimpleGrid
              spacingX={'16px'}
              spacingY={'20px'}
              columns={responsiveSpan}
              position={'relative'}
            >
              <LoadingComponent
                loading={assetLoading || poolsLoading || collectionLoading}
                top={0}
              />
              {isEmpty(assetsData?.list) ? (
                <GridItem colSpan={responsiveSpan}>
                  <EmptyComponent />
                </GridItem>
              ) : (
                assetsData?.list?.map((item) => {
                  if (!item) return null
                  const { node } = item
                  const { tokenID, nftAssetContract, name, id } = node || {}
                  return (
                    <MarketNftListCard
                      data={{ ...item, highestRate }}
                      imageSize={{
                        xl: grid === 4 ? '233px' : '316px',
                        lg: grid === 4 ? '148px' : '202px',
                        md: grid === 4 ? '172px' : '234px',
                        sm: '174px',
                        xs: '174px',
                      }}
                      key={`${tokenID}${nftAssetContract?.address}${name}`}
                      onClick={() => {
                        interceptFn(() => {
                          navigate(`/xlending/asset/detail`, {
                            state: {
                              collection: {
                                ...selectCollection?.nftCollection,
                              },
                              poolsList:
                                poolsMap && selectCollection?.contractAddress
                                  ? poolsMap.get(
                                      selectCollection.contractAddress,
                                    )
                                  : [],
                              assetVariable: {
                                assetId: id,
                                assetContractAddress: nftAssetContract?.address,
                                assetTokenID: tokenID,
                              },
                            },
                          })
                        })
                      }}
                    />
                  )
                })
              )}
              <GridItem colSpan={responsiveSpan}>
                <Flex justifyContent='center' mb={'40px'} p='20px' h='35px'>
                  {!noMore &&
                    (assetLoadingMore ? (
                      <Text>Loading more...</Text>
                    ) : (
                      <Button onClick={loadMore} variant='secondary'>
                        Click to load more
                      </Button>
                    ))}
                  {noMore && !isEmpty(assetsData?.list) && (
                    <Text>No more data</Text>
                  )}
                </Flex>
              </GridItem>
            </SimpleGrid>
          )}
          {!!debounceSearchValue && (
            <SimpleGrid
              spacingX={'16px'}
              spacingY={'20px'}
              columns={responsiveSpan}
              // overflowY='auto'
              position={'relative'}
              // overflowX='hidden'
            >
              <LoadingComponent
                loading={fetchAssetBySearchLoading || poolsLoading}
                top={0}
              />
              {!searchedAsset ? (
                <GridItem colSpan={responsiveSpan}>
                  <EmptyComponent />
                </GridItem>
              ) : (
                <MarketNftListCard
                  data={{
                    node: searchedAsset,
                    highestRate,
                  }}
                  key={`${searchedAsset.tokenID}${searchedAsset.assetContractAddress}${searchedAsset.name}`}
                  onClick={() => {
                    interceptFn(() => {
                      navigate(`/xlending/asset/detail`, {
                        state: {
                          collection: {
                            ...selectCollection?.nftCollection,
                          },
                          poolsList:
                            poolsMap && selectCollection?.contractAddress
                              ? poolsMap.get(selectCollection.contractAddress)
                              : [],
                          assetVariable: {
                            assetId: searchedAsset.id,
                            assetContractAddress:
                              searchedAsset.assetContractAddress,
                            assetTokenID: searchedAsset.tokenID,
                          },
                        },
                      })
                    })
                  }}
                />
              )}
              <GridItem colSpan={responsiveSpan} hidden={!!debounceSearchValue}>
                <Flex justifyContent='center' mb={'40px'} p='20px' h='35px'>
                  {!noMore &&
                    (assetLoadingMore ? (
                      <Text>Loading more...</Text>
                    ) : (
                      <Button onClick={loadMore} variant='secondary'>
                        Click to load more
                      </Button>
                    ))}
                  {noMore && !isEmpty(assetsData?.list) && (
                    <Text>No more data</Text>
                  )}
                </Flex>
              </GridItem>
            </SimpleGrid>
          )}
        </Box>
      </Flex>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </>
  )
}

export default Market
