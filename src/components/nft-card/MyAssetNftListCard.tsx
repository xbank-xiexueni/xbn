import {
  Box,
  Card,
  CardBody,
  CardFooter,
  type CardProps,
  Divider,
  Flex,
  Text,
  Tag,
} from '@chakra-ui/react'
import { type OwnedNft } from 'alchemy-sdk'

import { ImageWithFallback } from '..'

import type { FunctionComponent } from 'react'

const MortgagedTag = () => (
  <Tag
    variant={'outline'}
    color='red.1'
    borderColor='red.1'
    boxShadow={`inset 0 0 0px 1px var(--chakra-colors-red-1)`}
    p={2}
    borderRadius={8}
  >
    Mortgaged
  </Tag>
)
const MyAssetNftListCard: FunctionComponent<
  {
    data: OwnedNft
  } & CardProps
> = ({ data, ...rest }) => {
  return (
    <Card {...rest}>
      <CardBody p={0}>
        <Box bg='gray.100' borderTopRadius={16}>
          <ImageWithFallback
            src={data.media[0]?.thumbnail || data?.contract?.openSea?.imageUrl}
            alt={data.title}
            borderTopRadius={16}
            h='330px'
          />
        </Box>

        <Flex mt={3} justify='space-between' px={4} mb={2}>
          <Text
            fontSize='lg'
            fontWeight={'bold'}
            display='inline-block'
            overflow='hidden'
            whiteSpace='nowrap'
            w={'60%'}
            textOverflow='ellipsis'
          >
            {data.title}
          </Text>
          <MortgagedTag />
        </Flex>
      </CardBody>
      <Divider color='gray.2' px={4} />
      <CardFooter
        p={4}
        justify={'center'}
        alignItems='center'
        bg='blue.3'
        borderBottomRadius={16}
        mt={5}
      >
        <Text color={'white'} textAlign='center'>
          List For Sale
        </Text>
      </CardFooter>
    </Card>
  )
}

export default MyAssetNftListCard
