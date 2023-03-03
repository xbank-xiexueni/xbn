import {
  Box,
  Heading,
  Tabs,
  TabPanel,
  TabList,
  Tab,
  TabPanels,
  Tag,
  // Flex,
  SimpleGrid,
  Button,
} from '@chakra-ui/react'
import { useRequest } from 'ahooks'
import { Network, Alchemy } from 'alchemy-sdk'
import { useCallback, useState } from 'react'

import {
  EmptyComponent,
  LoadingComponent,
  MyAssetNftListCard,
  // SearchInput, Select
} from '@/components'

import type { OwnedNftsResponse, OwnedNft } from 'alchemy-sdk'
const settings = {
  apiKey: 'CKEavYcmO1qrcMnHtPmu78N_5TZLUt0n',
  network: Network.ETH_MAINNET,
}
const alchemy = new Alchemy(settings)

const MyAssets = () => {
  const [data, setData] = useState<OwnedNft[]>()
  const getNftsForOwner = useCallback(async () => {
    const nfts = await alchemy.nft.getNftsForOwner('0xshah.eth')
    return nfts
  }, [])
  const { loading } = useRequest(getNftsForOwner, {
    onSuccess: ({ ownedNfts }: OwnedNftsResponse) => {
      console.log('🚀 ~ file: MyAssets.tsx:36 ~ MyAssets ~ data:', data)
      setData(ownedNfts)
    },
    debounceWait: 100,
  })

  return (
    <Box>
      <Heading mt={'60px'} mb={14}>
        My Assets
      </Heading>
      <Button onClick={async () => {}}>aaa</Button>
      <Tabs position='relative'>
        <TabList
          _active={{
            color: 'blue.1',
            fontWeight: 'bold',
          }}
        >
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
            Collected &nbsp;
            <Tag
              bg='blue.1'
              color='white'
              borderRadius={15}
              fontSize={'xs'}
              h={5}
            >
              10
            </Tag>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {/* <Flex justify={'space-between'} mb={6} mt={10}>
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
                defaultValue={{
                  label: 'Price: low to high',
                  value: 1,
                }}
              />
            </Flex> */}
            <SimpleGrid
              minChildWidth='330px'
              spacing={'16px'}
              mt={10}
              position='relative'
            >
              <LoadingComponent loading={loading} />
              {!data || (data?.length === 0 && <EmptyComponent />)}
              {data?.map((item) => (
                <MyAssetNftListCard
                  data={item}
                  key={item.tokenId + item.title + item.contract.address}
                  onClick={() => {}}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default MyAssets
