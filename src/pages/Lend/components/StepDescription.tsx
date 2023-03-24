import { Box, Flex, Heading, Text, type BoxProps } from '@chakra-ui/react'

import type { FunctionComponent } from 'react'

const StepDescription: FunctionComponent<
  {
    data: {
      step: number
      title: string
      text: string
    }
  } & BoxProps
> = ({ data: { step, title, text }, ...rest }) => {
  return (
    <Box {...rest}>
      <Flex mb={'20px'} alignItems='center'>
        <Flex
          bg='blue.1'
          color='white'
          borderRadius={'50%'}
          mr={'16px'}
          w={'32px'}
          h={'32px'}
          justifyContent='center'
          lineHeight={2}
        >
          {step}
        </Flex>

        <Heading fontSize={'18px'} color='black.1' w='80%'>
          {title}
        </Heading>
      </Flex>
      <Text
        color='gray.3'
        fontWeight={'500'}
        whiteSpace='pre-wrap'
        fontSize={'14px'}
      >
        {text}
      </Text>
    </Box>
  )
}

export default StepDescription
