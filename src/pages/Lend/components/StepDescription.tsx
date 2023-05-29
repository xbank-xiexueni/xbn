import { Box, Flex, Heading, type BoxProps, Tooltip } from '@chakra-ui/react'

import { SvgComponent } from '@/components'

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
      <Tooltip label={text} placement='auto-start'>
        <Flex mb={'20px'} alignItems='center' gap={'16px'}>
          <Flex
            bg='blue.1'
            color='white'
            borderRadius={'50%'}
            w={'32px'}
            h={'32px'}
            justifyContent='center'
            fontSize='18px'
            lineHeight={2}
          >
            {step}
          </Flex>

          <Heading fontSize={'18px'} color='black.1'>
            {title}
          </Heading>
          <SvgComponent svgId='icon-tip' />
        </Flex>
      </Tooltip>
    </Box>
  )
}

export default StepDescription
