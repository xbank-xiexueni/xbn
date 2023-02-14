import {
  // Box,
  Grid,
  GridItem,
  Heading,
  Text,
  List,
  // Flex,
  SimpleGrid,
  Highlight,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import isEmpty from 'lodash-es/isEmpty'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiGetActiveCollection } from '@/api'
import { apiGetCollectionDetail } from '@/api/buyer'
import {
  LoadingComponent,
  // SearchInput,
  MarketNftListCard,
  // Select
} from '@/components'

import TEST_IMG from '@/assets/test-img.svg'

import CollectionDescription from './components/CollectionDescription'
import CollectionListItem from './components/CollectionListItem'

const Market = () => {
  const navigate = useNavigate()

  const [selectCollection, setSelectCollection] = useState<number>()
  const { data: collectionData, loading: collectionLoading } = useRequest(
    apiGetActiveCollection,
    {
      onSuccess: (data) => {
        if (isEmpty(data?.data?.list)) {
          return
        }
        setSelectCollection(data.data.list[0].id)
      },
      debounceWait: 100,
    },
  )

  const { data: detailData, loading: detailLoading } = useRequest(
    () => apiGetCollectionDetail(selectCollection as number),
    {
      ready: !!selectCollection,
      refreshDeps: [selectCollection],
    },
  )

  const descriptionData = useMemo(() => {
    const detail = detailData?.data
    if (isEmpty(detail)) {
      return {}
    }
    const { name, description } = detail
    return {
      img: TEST_IMG,
      title: name,
      isVerified: true,
      description,
      keys: [
        {
          label: 'Floor price',
          value: '15.18',
          isEth: true,
        },
        {
          label: 'Min DP',
          value: '9.32',
          isEth: true,
        },
        {
          label: (
            <Text
              fontSize={'sm'}
              fontWeight='500'
              color={`var(--chakra-colors-gray-3)`}
            >
              <Highlight
                styles={{
                  color: `red.1`,
                  fontWeight: 500,
                }}
                query='-900%'
              >
                24h -900%
              </Highlight>
            </Text>
          ),
          value: '85.86',
          isEth: true,
        },
        {
          label: 'supply',
          value: '10,0000',
        },
        {
          label: 'Listing',
          value: '700',
        },
      ],
    }
  }, [detailData])
  return (
    <Grid
      templateAreas={`"header header"
                  "nav main"
                  `}
      // gridTemplateRows={'50px 1fr 30px'}
      gridTemplateColumns={{
        lg: '360px 1fr',
        md: '260px 1fr',
      }}
      // h='200px'
      gap={9}
      // color='blackAlpha.700'
      // fontWeight='bold'
    >
      <GridItem area={'header'} mb={'10px'} pt={'60px'}>
        <Heading size={'2xl'}>Buy NFTs</Heading>
      </GridItem>
      <GridItem
        area={'nav'}
        border={`1px solid var(--chakra-colors-gray-2)`}
        borderRadius={12}
        p={6}
      >
        <Heading size={'md'} mb={4}>
          Collections
        </Heading>
        {/* <SearchInput placeholder='Collections...' /> */}

        <List spacing={4} mt={4} position='relative'>
          <LoadingComponent loading={collectionLoading} />

          {collectionData?.data?.list.map((item: any) => (
            <CollectionListItem
              data={{ id: item.id, name: item.col2 }}
              key={item.id}
              onClick={() => setSelectCollection(item.id)}
              isActive={selectCollection === item.id}
            />
          ))}
        </List>
      </GridItem>
      <GridItem area={'main'} position='relative'>
        <CollectionDescription loading={detailLoading} data={descriptionData} />

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
        <SimpleGrid minChildWidth='233px' spacing={'16px'} position='relative'>
          <LoadingComponent loading={detailLoading} />
          {detailData?.data?.list?.map((item: any) => (
            <MarketNftListCard
              data={{}}
              key={item.id}
              onClick={() => {
                navigate(`/asset/${item.id}`)
              }}
            />
          ))}
        </SimpleGrid>
      </GridItem>
    </Grid>
  )
}

export default Market
