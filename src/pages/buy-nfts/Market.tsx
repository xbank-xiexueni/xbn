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
import range from 'lodash/range'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  // SearchInput,
  MarketNftListCard,
  // Select
} from '@/components'
import COLORS from '@/utils/Colors'

import TEST_IMG from '@/assets/test-img.svg'

import CollectionDescription from './components/CollectionDescription'
import CollectionListItem from './components/CollectionListItem'

const Market = () => {
  const navigate = useNavigate()

  const [selectCollection, setSelectCollection] = useState<number>()
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
        border={`1px solid ${COLORS.borderColor}`}
        borderRadius={12}
        p={6}
      >
        <Heading size={'md'} mb={4}>
          Collections
        </Heading>
        {/* <SearchInput placeholder='Collections...' /> */}

        <List spacing={4} mt={4}>
          {range(10).map((item) => (
            <CollectionListItem
              data={{ id: item, name: 'xxxxxxx' }}
              key={item}
              onClick={() => setSelectCollection(item)}
              isActive={selectCollection === item}
            />
          ))}
        </List>
      </GridItem>
      <GridItem area={'main'}>
        <CollectionDescription
          data={{
            img: TEST_IMG,
            title: 'Lend',
            isVerified: true,
            description:
              'Provide funds to111111 11111 11111 11111 1111 111 111 11111 11111 111111 1111 111111 111111111 1111 1111 support NFT installment, obtain interest or collateral.',
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
                    color={COLORS.secondaryTextColor}
                  >
                    <Highlight
                      styles={{ color: COLORS.errorColor, fontWeight: 500 }}
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
          }}
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
        <SimpleGrid minChildWidth='233px' spacing={'16px'}>
          {range(15).map((item) => (
            <MarketNftListCard
              data={{}}
              key={item}
              onClick={() => {
                navigate(`/asset/${item}`)
              }}
            />
          ))}
        </SimpleGrid>
      </GridItem>
    </Grid>
  )
}

export default Market
