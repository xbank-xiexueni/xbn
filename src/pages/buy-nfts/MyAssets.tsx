import {
  Box,
  Heading,
  Tabs,
  TabPanel,
  TabList,
  Tab,
  TabPanels,
  Tag,
  SimpleGrid,
  GridItem,
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import { useRequest } from 'ahooks'
import isEmpty from 'lodash-es/isEmpty'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiGetMyAssets } from '@/api'
import {
  EmptyComponent,
  LoadingComponent,
  MyAssetNftListCard,
  SvgComponent,
} from '@/components'
import type { NftAsset } from '@/hooks'
import { useBatchAsset, useWallet } from '@/hooks'

import ListForSaleModal from './components/ListForSaleModal'

// const SORT_OPTIONS = [
//   {
//     label: 'Price: low to high',
//     value: {
//       direction: OrderDirection.Asc,
//       field: NftAssetOrderByField.Price,
//     },
//   },
//   {
//     label: 'Price: high to low',
//     value: {
//       direction: OrderDirection.Desc,
//       field: NftAssetOrderByField.Price,
//     },
//   },
//   {
//     label: 'Recent Created',
//     value: {
//       direction: OrderDirection.Desc,
//       field: NftAssetOrderByField.CreatedAt,
//     },
//   },
// ]

const MyAssets = () => {
  const navigate = useNavigate()
  const { interceptFn, currentAccount } = useWallet()
  // const [orderOption, setOrderOption] = useState(SORT_OPTIONS[0])
  // const [assetSearchValue, setAssetSearchValue] = useState('')
  // const debounceSearchValue = useDebounce(assetSearchValue, { wait: 500 })
  // console.log(
  //   '🚀 ~ file: MyAssets.tsx:63 ~ MyAssets ~ debounceSearchValue:',
  //   debounceSearchValue,
  // )
  const { data, loading } = useRequest(apiGetMyAssets, {
    debounceWait: 500,
    defaultParams: [
      {
        wallet_address:
          '0xa57dc20Ce8bba57177bF05EeD9E344c552469360' || currentAccount,
      },
    ],
  })

  const batchAssetParams = useMemo(() => {
    if (!data) return []
    return data?.data?.map((i) => ({
      assetContractAddress: i.asset_contract_address,
      assetTokenId: i.token_id,
    }))
  }, [data])
  const { data: batchNftListInfo } = useBatchAsset(batchAssetParams)

  useEffect(() => {
    interceptFn()
  }, [interceptFn])

  const [
    grid,
    // setGrid
  ] = useState(4)

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

  const {
    isOpen: listForSaleVisible,
    onClose: closeListForSale,
    onOpen: openListForSale,
  } = useDisclosure()
  const [currentSelectAsset, setCurrentSelectAsset] = useState<NftAsset>()

  return (
    <Box mb='100px'>
      <Flex
        py='20px'
        onClick={() => navigate(-1)}
        display={{
          md: 'none',
          sm: 'flex',
          xs: 'flex',
        }}
      >
        <SvgComponent svgId='icon-arrow-down' transform={'rotate(90deg)'} />
      </Flex>
      <Heading
        mt={{
          md: '60px',
          sm: '10px',
          xs: '10px',
        }}
        mb={{
          md: '56px',
          sm: '32px',
          xs: '32px',
        }}
        fontSize={{
          md: '48px',
          sm: '24px',
          xs: '24px',
        }}
      >
        My Assets
      </Heading>
      <Tabs position='relative'>
        <TabList
          _active={{
            color: 'blue.1',
            fontWeight: 'bold',
          }}
        >
          <Tab
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
            Collected &nbsp;
            {!isEmpty(data?.data) && (
              <Tag
                bg='blue.1'
                color='white'
                borderRadius={15}
                fontSize={'12px'}
                h={'20px'}
              >
                {data?.data?.length}
              </Tag>
            )}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {/* <Toolbar
              loading={loading}
              searchConfig={{
                searchValue: assetSearchValue,
                setSearchValue: (t) => setAssetSearchValue(t),
              }}
              sortConfig={{
                sortOptions: SORT_OPTIONS,
                sortValue: orderOption,
                setSortValue: (t) => setOrderOption(t),
              }}
              gridConfig={{
                gridValue: grid,
                setGridValue: (t) => setGrid(t),
              }}
              loadingProps={{
                mt: '25px',
              }}
            /> */}

            <SimpleGrid
              spacingX={'16px'}
              spacingY={'20px'}
              columns={responsiveSpan}
              position={'relative'}
              mt='20px'
            >
              <LoadingComponent loading={loading} top={0} />
              {(!data?.data || isEmpty(data?.data)) && (
                <GridItem colSpan={responsiveSpan}>
                  <EmptyComponent />
                </GridItem>
              )}
              {data?.data?.map((item) => {
                // const assetInfo = batchNftListInfo?.get(JSON.stringify({
                //   address: item.asset_contract_address.toLowerCase(),
                //   tokenId: item.token_id,
                // }))

                const assetInfo = batchNftListInfo?.find(
                  (i) =>
                    i.assetContractAddress.toLowerCase() ===
                      item.asset_contract_address.toLowerCase() &&
                    i.tokenID === item.token_id,
                )
                return (
                  <MyAssetNftListCard
                    key={`${item?.asset_contract_address}-${item.token_id}`}
                    imageSize={{
                      xl: grid === 4 ? '332px' : '445px',
                      lg: grid === 4 ? '220px' : '298px',
                      md: grid === 4 ? '170px' : '234px',
                      sm: '174px',
                      xs: '174px',
                    }}
                    assetInfo={assetInfo}
                    contractInfo={item}
                    onListForSale={() => {
                      console.log('click list for sale')
                      // @ts-ignore
                      setCurrentSelectAsset({
                        ...assetInfo,
                        tokenID: assetInfo?.tokenID || item.token_id,
                      })
                      openListForSale()
                    }}
                    onChangeList={() => {
                      console.log('click change list')
                    }}
                    onCancelList={() => {
                      console.log('click cancel list')
                    }}
                  />
                )
              })}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ListForSaleModal
        data={currentSelectAsset}
        isOpen={listForSaleVisible}
        onClose={closeListForSale}
        loanAmount={10}
      />
    </Box>
  )
}

export default MyAssets
