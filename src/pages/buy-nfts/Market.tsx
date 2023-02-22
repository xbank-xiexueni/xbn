import { Box, Flex, Heading, List, SimpleGrid } from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import isEmpty from 'lodash-es/isEmpty'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  apiGetActiveCollection,
  apiGetAssetsByCollection,
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
  const { data: collectionData, loading: collectionLoading } = useRequest(
    apiGetActiveCollection,
    {
      onSuccess: ({ data }) => {
        if (isEmpty(data)) {
          return
        }
        setSelectCollection(data[0])
      },
      debounceWait: 100,
    },
  )

  const { loading: assetListLoading, data: assetData = { data: [{ id: 1 }] } } =
    useRequest(
      () => apiGetAssetsByCollection(selectCollection?.contract_addr as string),
      {
        ready: !!selectCollection?.contract_addr && false,
        refreshDeps: [selectCollection?.contract_addr],
        onSuccess: () => {
          //
        },
      },
    )

  return (
    <>
      <Box mb={10} pt={15}>
        <Heading size={'2xl'}>Buy NFTs</Heading>
      </Box>

      <Flex
        mt={'10px'}
        justify='space-between'
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
          mb={10}
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

            {collectionData?.data?.map((item: CollectionListItemType) => (
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
        // w={{
        //   // xl: '',
        //   lg: '65%',
        //   md: '100%',
        // }}
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
            position='relative'
            columns={{
              xl: 4,
              lg: 3,
              md: 3,
              sm: 2,
            }}
          >
            <LoadingComponent loading={assetListLoading} />
            {assetData?.data?.map((item: any) => (
              <MarketNftListCard
                data={{ name: 'xxn' }}
                key={item.id}
                onClick={() => {
                  interceptFn(() => {
                    navigate(`/asset/${item.id}`, {
                      state: selectCollection,
                    })
                  })
                }}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </>
  )
}

export default Market
