import { Box, Flex, Heading, Tag, Text } from '@chakra-ui/react'

import COLORS from '@/utils/Colors'

import type { BoxProps } from '@chakra-ui/react'
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
          bg={COLORS.primaryColor}
          color='white'
          borderRadius={'50%'}
          mr={4}
          w={8}
          h={8}
          justifyContent='center'
        >
          {step}
        </Tag>
        <Heading size={'md'}>{title}</Heading>
      </Flex>
      <Text color={COLORS.secondaryTextColor}>{text}</Text>
    </Box>
  )
}

export default StepDescription
