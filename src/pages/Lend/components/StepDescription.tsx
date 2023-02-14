import { Box, Flex, Heading, Tag, Text, type BoxProps } from '@chakra-ui/react'

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
      <Flex mb={5} alignItems='center'>
        <Tag
          bg='blue.1'
          color='white'
          borderRadius={'50%'}
          mr={4}
          w={8}
          h={8}
          justifyContent='center'
          lineHeight={2}
        >
          {step}
        </Tag>
        <Heading size={'md'} color='black.1'>
          {title}
        </Heading>
      </Flex>
      <Text color='gray.3'>{text}</Text>
    </Box>
  )
}

export default StepDescription
