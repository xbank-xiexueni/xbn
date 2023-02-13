import { Box, type BoxProps } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

import COLORS from '@/utils/Colors'

type RadioCardProps = {
  isActive?: boolean
}

const RadioCard: FunctionComponent<BoxProps & RadioCardProps> = ({
  children,
  isActive,
  ...props
}) => {
  return (
    <Box
      {...props}
      w='100%'
      cursor='pointer'
      borderWidth={isActive ? '2px' : '1px'}
      borderRadius='16'
      borderColor={isActive ? COLORS.primaryColor : COLORS.tipTextColor}
      _hover={{
        borderColor: isActive ? COLORS.primaryColor : COLORS.textColor,
      }}
      p={4}
    >
      {children}
    </Box>
  )
}

export default RadioCard
