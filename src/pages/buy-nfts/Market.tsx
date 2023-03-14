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
import { useCallback, useMemo, useState } from 'react'
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
  // Select
} from '@/components'
import type { NftCollection } from '@/hooks'
import {
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
  // const debounceSearchValue = useDebounce(searchValue, { wait: 500 })
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
  const [runAsync] = useNftCollectionAssetsLazyQuery({
    fetchPolicy: 'network-only',
  })

  const getLoadMoreList = useCallback(
    async (after: string | null, first: number) => {
      if (!selectCollection?.nftCollection?.id || !runAsync)
        return {
          list: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        }
      const { data } = await runAsync({
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
    [runAsync, selectCollection, orderOption],
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
          height={'70vh'}
          // overflowY='auto'
          // overflowX={'visible'}
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
              <Box w='70%'>
                <SearchInput
                  placeholder={'精确搜索？'}
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
            </Flex>
          )}

          <SimpleGrid
            spacingX={4}
            spacingY={5}
            columns={{
              xl: 4,
              lg: 3,
              md: 3,
              sm: 2,
            }}
            // overflowY='auto'
            position={'relative'}
            // overflowX='hidden'
          >
            <LoadingComponent loading={assetLoading || poolsLoading} />
            {isEmpty(assetsData?.list) ? (
              <GridItem
                colSpan={{
                  xl: 4,
                  lg: 3,
                  md: 3,
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
                              ...selectCollection,
                              lowestPrice: '',
                            },
                            poolsList:
                              poolsMap && selectCollection?.contractAddress
                                ? poolsMap.get(selectCollection.contractAddress)
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
            <GridItem colSpan={4}>
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
        </Box>
      </Flex>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </>
  )
}

export default Market
