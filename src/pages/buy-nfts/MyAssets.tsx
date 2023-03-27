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
  GridItem,
  Flex,
} from '@chakra-ui/react'
import isEmpty from 'lodash-es/isEmpty'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  EmptyComponent,
  LoadingComponent,
  MyAssetNftListCard,
  SvgComponent,
  // SearchInput, Select
} from '@/components'
import {
  NftAssetOrderByField,
  OrderDirection,
  useAssetsQuery,
  useWallet,
} from '@/hooks'

const MyAssets = () => {
  const navigate = useNavigate()
  const { interceptFn } = useWallet()
  useEffect(() => {
    interceptFn()
  }, [interceptFn])
  const { data, loading } = useAssetsQuery({
    variables: {
      tag: 'ART',
      orderBy: {
        direction: OrderDirection.Asc,
        field: NftAssetOrderByField.CreatedAt,
      },
    },
  })

  const [grid] = useState(4)

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
  return (
    <Box>
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
            {!isEmpty(data) && (
              <Tag
                bg='blue.1'
                color='white'
                borderRadius={15}
                fontSize={'12px'}
                h={'20px'}
              >
                {data?.assets.edges?.length}
              </Tag>
            )}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {/* <Flex justify={'space-between'} mb='24px' mt={'40px'}>
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
              spacingX={'16px'}
              spacingY={'20px'}
              columns={responsiveSpan}
              position={'relative'}
              mt='20px'
            >
              <LoadingComponent loading={loading} />
              {(!data || isEmpty(data)) && (
                <GridItem colSpan={responsiveSpan}>
                  <EmptyComponent />
                </GridItem>
              )}
              {data?.assets?.edges?.map((item) => (
                <MyAssetNftListCard
                  data={item}
                  key={`${item?.node?.tokenID} + ${item?.node?.name} + $after{item?.node?.nftAssetContract.address}`}
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
