import {
  Box,
  Card,
  CardBody,
  CardFooter,
  type CardProps,
  Divider,
  Flex,
  Image,
  Text,
  Tag,
} from '@chakra-ui/react'

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
    // temp
    data: any
  } & CardProps
> = ({ data, ...rest }) => {
  console.log(data, 'MyAssetNftListCard')
  return (
    <Card {...rest}>
      <CardBody p={0}>
        <Box bg='gray.100' borderTopRadius={16}>
          <Image
            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
            alt='Green double couch with wooden legs'
            borderTopRadius={'lg'}
            h='330px'
            fit='contain'
          />
        </Box>

        <Flex mt={3} justify='space-between' px={4} mb={2}>
          <Text fontSize='lg' fontWeight={'bold'}>
            Azuki #6671
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
