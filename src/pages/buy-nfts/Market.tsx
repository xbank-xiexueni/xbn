import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  List,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import useDebounce from 'ahooks/lib/useDebounce'
import useInfiniteScroll from 'ahooks/lib/useInfiniteScroll'
import useRequest from 'ahooks/lib/useRequest'
import filter from 'lodash-es/filter'
import isEmpty from 'lodash-es/isEmpty'
import maxBy from 'lodash-es/maxBy'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { PoolsListItemType } from '@/api'
import { apiGetPools } from '@/api'
import {
  ConnectWalletModal,
  EmptyComponent,
  LoadingComponent,
  // SearchInput,
  MarketNftListCard,
  SearchInput,
  Select,
  SvgComponent,
  // Select
} from '@/components'
import type { NftAsset, NftCollection } from '@/hooks'
import {
  useNftCollectionSearchAssetLazyQuery,
  NftAssetOrderByField,
  OrderDirection,
  useNftCollectionAssetsLazyQuery,
  useWallet,
  useNftCollectionsByContractAddressesQuery,
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
  const { isOpen, onClose, interceptFn } = useWallet()
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
    onSuccess: ({ data }) => {
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

        setSelectCollection(data.nftCollectionsByContractAddresses[0])
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

  return (
    <>
      <Box mb={10} mt={'60px'}>
        <Heading size={'2xl'}>Buy NFTs</Heading>
      </Box>

      <Flex
        mt={'10px'}
        flexWrap={{ lg: 'nowrap', md: 'wrap', sm: 'wrap' }}
        gap={9}
      >
        <Box
          border={`1px solid var(--chakra-colors-gray-2)`}
          borderRadius={12}
          p={6}
          w={{
            xl: '360px',
            lg: '260px',
            md: '100%',
            sm: '100%',
          }}
          height={{
            xl: '70vh',
            lg: '70vh',
          }}
          overflowY='auto'
          overflowX={'visible'}
        >
          <Heading size={'md'} mb={4}>
            Collections
          </Heading>
          <SearchInput
            placeholder='Collections...'
            isDisabled={collectionLoading || poolsLoading}
            value={collectionSearchValue}
            onChange={(e) => {
              setCollectionSearchValue(e.target.value)
            }}
          />

          <List spacing={4} mt={4} position='relative'>
            <LoadingComponent loading={collectionLoading || poolsLoading} />
            {filteredCollectionList &&
              isEmpty(filteredCollectionList) &&
              !collectionLoading && <EmptyComponent />}

            {filteredCollectionList?.map((item) => (
              <CollectionListItem
                data={{
                  contractAddress: item.contractAddress,
                  ...item.nftCollection,
                }}
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

        <Box
          w={{
            xl: '980px',
            lg: '640px',
            md: '100%',
            sm: '100%',
          }}
        >
          <CollectionDescription
            loading={collectionLoading || poolsLoading}
            data={selectCollection?.nftCollection}
            highestRate={highestRate}
          />
          {collectionLoading || poolsLoading ? (
            <Skeleton height={16} borderRadius={16} mb={6} />
          ) : (
            <Flex justify={'space-between'} mb={6}>
              <Box
                w={{
                  xl: '55%',
                  lg: '44%',
                  md: '50%',
                }}
              >
                <SearchInput
                  placeholder={'Search...'}
                  isDisabled={
                    assetLoading ||
                    poolsLoading ||
                    assetLoadingMore ||
                    isEmpty(assetsData?.list)
                  }
                  value={assetSearchValue}
                  onChange={(e) => {
                    setAssetSearchValue(e.target.value)
                  }}
                />
              </Box>
              <Flex alignItems={'center'} gap={5}>
                <Select
                  options={SORT_OPTIONS}
                  value={orderOption}
                  defaultValue={SORT_OPTIONS[0]}
                  onChange={(target) => {
                    if (!target) return
                    setOrderOption(target)
                  }}
                  isDisabled={isEmpty(assetsData?.list)}
                  borderColor={'var(--chakra-colors-gray-2)'}
                />
                <Flex
                  borderColor={'gray.2'}
                  borderWidth={1}
                  borderRadius={8}
                  display={{
                    xl: 'flex',
                    lg: 'flex',
                    md: 'flex',
                    sm: 'none',
                  }}
                >
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
            </Flex>
          )}

          {!debounceSearchValue && (
            <SimpleGrid
              spacingX={4}
              spacingY={5}
              columns={{
                xl: grid,
                lg: grid,
                md: grid,
                sm: 2,
              }}
              position={'relative'}
            >
              <LoadingComponent
                loading={assetLoading || poolsLoading || collectionLoading}
              />
              {isEmpty(assetsData?.list) ? (
                <GridItem
                  colSpan={{
                    xl: grid,
                    lg: grid,
                    md: grid,
                    sm: 2,
                  }}
                >
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
                      key={`${tokenID}${nftAssetContract?.address}${name}`}
                      onClick={() => {
                        interceptFn(() => {
                          navigate(`/asset/detail`, {
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
              <GridItem colSpan={grid}>
                <Flex justifyContent='center' mb={5}>
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
              spacingX={4}
              spacingY={5}
              columns={{
                xl: grid,
                lg: grid,
                md: grid,
                sm: 2,
              }}
              // overflowY='auto'
              position={'relative'}
              // overflowX='hidden'
            >
              <LoadingComponent
                loading={fetchAssetBySearchLoading || poolsLoading}
              />
              {!searchedAsset ? (
                <GridItem
                  colSpan={{
                    xl: grid,
                    lg: grid,
                    md: grid,
                    sm: 2,
                  }}
                >
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
                      navigate(`/asset/detail`, {
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
              <GridItem colSpan={4} hidden={!!debounceSearchValue}>
                <Flex justifyContent='center' mb={5}>
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
