import {
  Box,
  Grid,
  GridItem,
  Heading,
  List,
  Image,
  Text,
  ListItem,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react'
import range from 'lodash/range'
import { useState, type FunctionComponent } from 'react'

import { InputSearch, NftListCard } from '@/components'
import COLORS from '@/utils/Colors'

import IconChecked from '@/assets/icon/icon-checked.svg'
import IconVerifiedFill from '@/assets/icon/icon-verified-fill.svg'

const CollectionListItem: FunctionComponent<{
  data: {
    ID: number
  }
  onClick: () => void
  isActive?: boolean
}> = ({ data: { ID }, onClick, isActive }) => {
  return (
    <ListItem
      key={ID}
      px={4}
      py={3}
      display='flex'
      alignItems={'center'}
      justifyContent='space-between'
      border={`1px solid ${COLORS.borderColor}`}
      borderRadius={8}
      _hover={{
        bg: COLORS.secondaryColor,
      }}
      cursor='pointer'
      bg={isActive ? COLORS.secondaryColor : 'white'}
      onClick={onClick}
    >
      <Flex alignItems={'center'}>
        <Box w={6} h={6} bg='gray.600' mr={4} />
        <Text fontSize={'sm'}>
          {ID}
          {ID}
          {ID}
          {ID}
          {ID}
          {ID}
          &nbsp;
        </Text>
        <Image src={IconVerifiedFill} />
      </Flex>
      {isActive ? (
        <Image src={IconChecked} />
      ) : (
        <Text fontSize={'sm'}>{ID}</Text>
      )}
    </ListItem>
  )
}

const Market = () => {
  const [selectCollection, setSelectCollection] = useState<number>()
  return (
    <Grid
      templateAreas={`"header header"
                  "nav main"
                  `}
      // gridTemplateRows={'50px 1fr 30px'}
      gridTemplateColumns={'360px 1fr'}
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
        <InputSearch placeholder='Collections...' />

        <List spacing={4} mt={4}>
          {range(10).map((item) => (
            <CollectionListItem
              data={{ ID: item }}
              key={item}
              onClick={() => setSelectCollection(item)}
              isActive={selectCollection === item}
            />
          ))}
        </List>
      </GridItem>
      <GridItem pl='2' area={'main'}>
        <SimpleGrid minChildWidth='230px' spacing={'16px'}>
          {range(15).map((item) => (
            <NftListCard data={{}} key={item} />
          ))}
        </SimpleGrid>
      </GridItem>
    </Grid>
  )
}

export default Market
