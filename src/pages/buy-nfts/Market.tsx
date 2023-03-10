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
// import useDebounce from 'ahooks/lib/useDebounce'
import useInfiniteScroll from 'ahooks/lib/useInfiniteScroll'
import useRequest from 'ahooks/lib/useRequest'
import isEmpty from 'lodash-es/isEmpty'
import maxBy from 'lodash-es/maxBy'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { CollectionListItemType } from '@/api'
import { apiGetActiveCollection, apiGetPools } from '@/api'
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
import {
  NftAssetOrderByField,
  OrderDirection,
  useNftCollectionAssetsLazyQuery,
  useWallet,
} from '@/hooks'

import CollectionDescription from './components/CollectionDescription'
import CollectionListItem from './components/CollectionListItem'

export type NftCollectionByFamousType = {
  __typename?: 'NFTFamous' | undefined
  id: string
  name: string
  image_url: string
  tags?: string[] | null | undefined
}

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

  const [selectCollection, setSelectCollection] =
    useState<CollectionListItemType>()

  const [searchValue, setSearchValue] = useState('')
  const [orderOption, setOrderOption] = useState(SORT_OPTIONS[0])
  const [highestRate, setHighRate] = useState<number>()

  const { loading: poolsLoading, data: poolsData } = useRequest(
    () =>
      apiGetPools({
        // allow_collateral_contract: selectCollection?.contract_addr || '',
        allow_collateral_contract: '0x09e8617f391c54530cc2d3762ceb1da9f840c5a3',
      }),
    {
      onSuccess: ({ data }) => {
        if (isEmpty(data)) {
          return
        }
        const maxRate = maxBy(
          data,
          ({ pool_maximum_percentage }) => pool_maximum_percentage,
        )?.pool_maximum_percentage
        if (!maxRate) {
          setHighRate(undefined)
          return
        }
        setHighRate(maxRate)
      },
      ready: !!selectCollection?.id,
      refreshDeps: [selectCollection?.id],
      debounceWait: 100,
    },
  )

  // 根据 collectionId 搜索 assets
  const [runAsync] = useNftCollectionAssetsLazyQuery({
    fetchPolicy: 'network-only',
  })

  const getLoadMoreList = useCallback(
    async (after: string | null, first: number) => {
      if (!selectCollection?.id || !runAsync)
        return {
          list: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        }
      const { data } = await runAsync({
        variables: {
          collectionId: `${selectCollection?.id}`,
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
      reloadDeps: [selectCollection?.id, orderOption],
      // threshold: 10,
      manual: true,
    },
  )

  const { loading: collectionLoading, data: collectionData } = useRequest(
    apiGetActiveCollection,
    {
      onSuccess: ({ data }) => {
        if (isEmpty(data)) {
          return
        }
        setSelectCollection({ ...data[0], id: '9089444724400130' })
      },
      debounceWait: 100,
    },
  )
  // const debounceSearchValue = useDebounce(searchValue, { wait: 500 })
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
          {/* <SearchInput placeholder='Collections...' /> */}

          <List spacing={4} mt={4} position='relative'>
            <LoadingComponent loading={collectionLoading} />
            {isEmpty(collectionData?.data) && !collectionLoading && (
              <EmptyComponent />
            )}

            {collectionData?.data?.map((item) => (
              <CollectionListItem
                data={{ ...item }}
                key={`${item.id}${item.contract_addr}`}
                onClick={() => {
                  setSelectCollection({ ...item, id: '9089443801653250' })
                  setOrderOption(SORT_OPTIONS[0])
                  setHighRate(undefined)
                }}
                isActive={
                  // selectCollection?.id === item.id &&
                  selectCollection?.contract_addr === item.contract_addr
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
            loading={collectionLoading}
            data={selectCollection}
          />
          {collectionLoading ? (
            <Skeleton height={16} borderRadius={16} mb={6} />
          ) : (
            <Flex justify={'space-between'} mb={6}>
              <Box w='70%'>
                <SearchInput
                  placeholder={'精确搜索？'}
                  isDisabled={assetLoading || poolsLoading || assetLoadingMore}
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
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
                            poolsList: poolsData?.data,
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
