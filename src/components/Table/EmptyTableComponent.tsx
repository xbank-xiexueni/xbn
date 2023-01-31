import { Box, Flex, Image, Text } from '@chakra-ui/react'

import COLORS from '@/utils/Colors'

import defaultEmptyIcon from '@/assets/empty.svg'

import type { FunctionComponent } from 'react'

const EmptyTableComponent: FunctionComponent<{
  icon?: string
  description?: string
}> = ({ icon, description }) => {
  return (
    <Box textAlign={'center'} my={20}>
      <Flex justify={'center'} mb={4}>
        <Image src={icon || defaultEmptyIcon} />
      </Flex>
      <Text color={COLORS.secondaryTextColor}>
        {description || 'no Data yet...'}
      </Text>
    </Box>
  )
}

export default EmptyTableComponent
