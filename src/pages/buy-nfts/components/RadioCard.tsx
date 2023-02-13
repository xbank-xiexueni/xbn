import { Flex, type FlexProps } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

import COLORS from '@/utils/Colors'

type RadioCardProps = {
  isActive?: boolean
}

const RadioCard: FunctionComponent<FlexProps & RadioCardProps> = ({
  children,
  isActive,
  ...props
}) => {
  return (
    <Flex
      flexDir={'column'}
      h='136px'
      justifyContent='space-between'
      {...props}
      w='100%'
      cursor='pointer'
      borderWidth={1}
      borderRadius='16'
      borderColor={isActive ? COLORS.primaryColor : COLORS.tipTextColor}
      _hover={{
        borderColor: isActive ? COLORS.primaryColor : COLORS.textColor,
      }}
      p={4}
    >
      {children}
    </Flex>
  )
}

export default RadioCard
