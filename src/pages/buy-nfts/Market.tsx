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
  HStack,
} from '@chakra-ui/react'
import range from 'lodash/range'
import { useState, type FunctionComponent, type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { InputSearch, NftListCard, Select } from '@/components'
import COLORS from '@/utils/Colors'

import IconChecked from '@/assets/icon/icon-checked.svg'
import IconEth from '@/assets/icon/icon-eth.svg'
import IconVerifiedFill from '@/assets/icon/icon-verified-fill.svg'
import TEST_IMG from '@/assets/test-img.svg'

const DescriptionComponent: FunctionComponent<{
  data: {
    isVerified?: boolean
    titleImage?: string
    title?: string
    description?: string
    img?: string
    keys?: {
      value: string
      label: string | ReactElement
      isEth?: boolean
    }[]
  }
}> = ({
  data: {
    title = '',
    description = '',
    img = '',
    keys = [],
    isVerified = false,
  },
}) => {
  const [show, setShow] = useState(false)
  return (
    <Box mb={12}>
      <Flex gap={5} alignItems='end' mb={8}>
        <Box minW='108px'>
          <Image src={img} />
        </Box>
        <Box>
          <Heading fontSize={'3xl'} display='flex'>
            {title}
            {isVerified && <Image src={IconVerifiedFill} />}
          </Heading>

          <Text
            color={COLORS.secondaryTextColor}
            mt={2}
            fontSize={'md'}
            fontWeight='medium'
          >
            {show ? description : `${description.substring(0, 80)}...`}
            {description?.length > 80 && (
              <a
                color={COLORS.primaryColor}
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? 'show less' : 'show'}
              </a>
            )}
          </Text>
        </Box>
      </Flex>

      <HStack spacing={10}>
        {keys.map(({ label, value, isEth }) => (
          <Box key={`${label}`}>
            <Heading fontSize={'2xl'} display='flex' mb={1}>
              {isEth && <Image src={IconEth} height={8} />}
              {value}
            </Heading>
            {typeof value === 'string' ? (
              <Text color={COLORS.infoTextColor}>{label}</Text>
            ) : (
              label
            )}
          </Box>
        ))}
      </HStack>
    </Box>
  )
}

export const CollectionListItem: FunctionComponent<{
  data: {
    ID: number
  }
  onClick?: () => void
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
  const navigate = useNavigate()

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
        <DescriptionComponent
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
                label: '24h -922%',
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

        <Flex justify={'space-between'} mb={6}>
          <Box w='70%'>
            <InputSearch />
          </Box>
          <Box w='20%'>
            <Select
              options={[
                {
                  label: 'Price: low to high',
                  value: 1,
                },
              ]}
            />
          </Box>
        </Flex>
        <SimpleGrid minChildWidth='230px' spacing={'16px'}>
          {range(15).map((item) => (
            <NftListCard
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
