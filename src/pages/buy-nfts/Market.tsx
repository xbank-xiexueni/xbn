import {
  Box,
  Flex,
  GridItem,
  Heading,
  List,
  SimpleGrid,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import { maxBy, minBy } from 'lodash-es'
import isEmpty from 'lodash-es/isEmpty'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  apiGetActiveCollection,
  apiGetAssetsByCollection,
  apiGetPools,
  type CollectionListItemType,
} from '@/api'
import {
  ConnectWalletModal,
  EmptyComponent,
  LoadingComponent,
  // SearchInput,
  MarketNftListCard,
  // Select
} from '@/components'
import { useWallet } from '@/hooks'
import { wei2Eth } from '@/utils/unit-conversion'

import CollectionDescription from './components/CollectionDescription'
import CollectionListItem from './components/CollectionListItem'

const Market = () => {
  const navigate = useNavigate()
  const { isOpen, onClose, interceptFn } = useWallet()

  const [selectCollection, setSelectCollection] = useState<{
    name: string
    image_url: string
    contract_addr: string
  }>()
  const [collectionList, setCollectionList] = useState<
    CollectionListItemType[]
  >([])
  const { loading: collectionLoading } = useRequest(apiGetActiveCollection, {
    onSuccess: ({ data }) => {
      if (isEmpty(data)) {
        return
      }
      setCollectionList([...data])
      setSelectCollection(data[0])
    },
    debounceWait: 100,
  })
  const [highestRate, setHighRate] = useState<number>()
  const [lowestPrice, setLowestPrice] = useState<string>()

  const { loading: poolsLoading, data: poolsData } = useRequest(
    () =>
      apiGetPools({
        allow_collateral_contract: selectCollection?.contract_addr || '',
      }),
    {
      onSuccess: ({ data }) => {
        if (isEmpty(data)) return
        const maxRate = maxBy(
          data,
          ({ pool_maximum_interest_rate }) => pool_maximum_interest_rate,
        )?.pool_maximum_interest_rate
        setHighRate(maxRate)
      },
      ready: !!selectCollection?.contract_addr,
      refreshDeps: [selectCollection?.contract_addr],
      debounceWait: 100,
    },
  )

  const { loading: assetListLoading, data: assetData } = useRequest(
    () =>
      apiGetAssetsByCollection({
        asset_contract_address: selectCollection?.contract_addr,
      }),
    {
      ready: !!selectCollection?.contract_addr,
      refreshDeps: [selectCollection?.contract_addr],
      onSuccess: ({ data }) => {
        if (isEmpty(data)) return
        const weiPrice = minBy(data, ({ order_price }) =>
          wei2Eth(order_price),
        )?.order_price
        if (!weiPrice) return
        setLowestPrice(wei2Eth(weiPrice))
      },
    },
  )

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
          height={'76vh'}
          // overflowY='auto'
          // overflowX={'visible'}
        >
          <Heading size={'md'} mb={4}>
            Collections
          </Heading>
          {/* <SearchInput placeholder='Collections...' /> */}

          <List spacing={4} mt={4} position='relative'>
            <LoadingComponent loading={collectionLoading} />
            {isEmpty(collectionList) && !collectionLoading && (
              <EmptyComponent />
            )}

            {collectionList.map((item: CollectionListItemType) => (
              <CollectionListItem
                data={{ ...item }}
                key={item.contract_addr}
                onClick={() => setSelectCollection(item)}
                isActive={
                  selectCollection?.contract_addr === item.contract_addr
                }
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
          {/* <Flex justify={'space-between'} mb={6}>
          <Box w='70%'>
            <SearchInput />
          </Box>
          <Select
            options={[
              {
                label: 'Price: low to high',
                value: 1,
              },
            ]}
          />
        </Flex> */}
          <SimpleGrid
            spacing={4}
            columns={{
              xl: 4,
              lg: 3,
              md: 3,
              sm: 2,
            }}
            height={'66vh'}
            overflowY='auto'
            position={'relative'}
            overflowX='hidden'
          >
            <LoadingComponent loading={assetListLoading || poolsLoading} />
            {isEmpty(assetData?.data) ? (
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
              assetData?.data?.map((item) => (
                <MarketNftListCard
                  data={{ ...item, highestRate }}
                  key={item.token_id}
                  onClick={() => {
                    interceptFn(() => {
                      navigate(`/asset/detail`, {
                        state: {
                          collection: { ...selectCollection, lowestPrice },
                          poolsList: poolsData?.data,
                          asset: item,
                        },
                      })
                    })
                  }}
                />
              ))
            )}
          </SimpleGrid>
        </Box>
      </Flex>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </>
  )
}

export default Market
