import { Box, type BoxProps, Flex, Text } from '@chakra-ui/react'

import defaultEmptyIcon from '@/assets/empty.svg'

import { ImageWithFallback } from '..'

import type { FunctionComponent, ReactElement } from 'react'

const EmptyComponent: FunctionComponent<
  {
    icon?: string
    description?: string
    action?: () => ReactElement
  } & BoxProps
> = ({ icon, description, action, ...rest }) => {
  return (
    <Box textAlign={'center'} my={20} {...rest}>
      <Flex justify={'center'} mb={4}>
        <ImageWithFallback src={icon || defaultEmptyIcon} w='40px' h='40px' />
      </Flex>
      <Text color='gray.3' mb={6} fontSize='sm' fontWeight={'700'}>
        {description || 'no Data yet...'}
      </Text>
      {action && action()}
    </Box>
  )
}

export default EmptyComponent
