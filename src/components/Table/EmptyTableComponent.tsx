import { Box, Flex, Image, Text } from '@chakra-ui/react'

import defaultEmptyIcon from '@/assets/empty.svg'

import type { FunctionComponent, ReactElement } from 'react'

const EmptyTableComponent: FunctionComponent<{
  icon?: string
  description?: string
  action?: () => ReactElement
}> = ({ icon, description, action }) => {
  return (
    <Box textAlign={'center'} my={20}>
      <Flex justify={'center'} mb={4}>
        <Image src={icon || defaultEmptyIcon} />
      </Flex>
      <Text color='gray.3' mb={6} fontSize='sm' fontWeight={'700'}>
        {description || 'no Data yet...'}
      </Text>
      {action && action()}
    </Box>
  )
}

export default EmptyTableComponent
