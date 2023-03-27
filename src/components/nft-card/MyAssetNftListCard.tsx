import {
  Box,
  Card,
  CardBody,
  CardFooter,
  type CardProps,
  Flex,
  Text,
} from '@chakra-ui/react'
import get from 'lodash-es/get'
import { useState } from 'react'

import { ImageWithFallback } from '..'

import type { FunctionComponent } from 'react'

const MortgagedTag = () => (
  <Box
    borderColor='red.1'
    boxShadow={`inset 0 0 0px 1px var(--chakra-colors-red-1)`}
    p={{
      lg: '8px',
      md: '4px',
    }}
    borderRadius={8}
  >
    <Text
      noOfLines={1}
      fontSize={'12px'}
      fontWeight='700'
      color='red.1'
      transform={{
        md: 'none',
        sm: `scale(0.6666)`,
        xs: `scale(0.6666)`,
      }}
      transformOrigin='center'
    >
      Mortgaged
    </Text>
  </Box>
)
const MyAssetNftListCard: FunctionComponent<
  {
    data: any
  } & CardProps
> = ({ data, ...rest }) => {
  const item = get(data, 'node')
  const [show, setShow] = useState(false)

  return (
    <Card
      {...rest}
      _hover={{
        boxShadow: `var(--chakra-colors-gray-1) 0px 0px 10px`,
      }}
      cursor='pointer'
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      borderRadius={16}
      border='none'
      w='100%'
      h={'100%'}
    >
      <CardBody p={0} border='none'>
        <Box bg={'white'} borderTopRadius={16} overflow='hidden'>
          <ImageWithFallback
            src={item.imagePreviewUrl}
            alt={item.name}
            borderTopRadius={16}
            // h='330px'
            h={{
              xl: '332px',
              lg: '230px',
              md: '172px',
              sm: '174px',
              xs: '174px',
            }}
            w='100%'
            fit='contain'
            transform={`scale(${show ? 1.2 : 1})`}
            transition='all 0.6s'
          />
        </Box>

        <Flex
          mt={'12px'}
          justify='space-between'
          px='16px'
          mb={'4px'}
          alignItems='center'
          flexWrap={{
            md: 'nowrap',
            sm: 'wrap',
            xs: 'wrap',
          }}
        >
          <Text
            fontSize='18px'
            fontWeight={'bold'}
            display='inline-block'
            overflow='hidden'
            whiteSpace='nowrap'
            w={'60%'}
            textOverflow='ellipsis'
          >
            {item.name || `#${item.tokenID || ''}`}
          </Text>
          {item.name.length % 2 === 1 && <MortgagedTag />}
        </Flex>
      </CardBody>
      <CardFooter
        p={{
          lg: '16px',
          md: '10px',
          sm: '8px',
          xs: '8px',
        }}
        justify={'center'}
        alignItems='center'
        bg={item.name.length % 2 === 0 ? 'blue.3' : 'white'}
        borderBottomRadius={16}
        mt={{
          md: '20px',
          sm: '15px',
          xs: '15px',
        }}
      >
        <Text color={'white'} textAlign='center'>
          List For Sale
        </Text>
      </CardFooter>
    </Card>
  )
}

export default MyAssetNftListCard
