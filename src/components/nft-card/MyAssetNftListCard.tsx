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

import { ImageWithFallback } from '..'

import type { FunctionComponent } from 'react'

const MortgagedTag = () => (
  <Tag
    variant={'outline'}
    color='red.1'
    borderColor='red.1'
    boxShadow={`inset 0 0 0px 1px var(--chakra-colors-red-1)`}
    p={'4px'}
    borderRadius={8}
  >
    Mortgaged
  </Tag>
)
const MyAssetNftListCard: FunctionComponent<
  {
    // temp
    data: any
  } & CardProps
> = ({ data, ...rest }) => {
  console.log(data, 'MyAssetNftListCard')
  return (
    <Card {...rest}>
      <CardBody p={0}>
        <Box bg='gray.100' borderTopRadius={16}>
          <ImageWithFallback
            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
            alt='Green double couch with wooden legs'
            borderTopRadius={'lg'}
            h='330px'
            fit='contain'
          />
        </Box>

        <Flex mt={'12px'} justify='space-between' px='16px' mb={'4px'}>
          <Text fontSize='lg' fontWeight={'bold'}>
            Azuki #6671
          </Text>
          <MortgagedTag />
        </Flex>
      </CardBody>
      <Divider color='gray.2' px='16px' />
      <CardFooter
        p='16px'
        justify={'center'}
        alignItems='center'
        bg='blue.3'
        borderBottomRadius={16}
        mt={'20px'}
      >
        <Text color={'white'} textAlign='center'>
          List For Sale
        </Text>
      </CardFooter>
    </Card>
  )
}

export default MyAssetNftListCard
