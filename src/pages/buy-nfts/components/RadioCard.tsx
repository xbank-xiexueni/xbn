import { Box, useRadio, type UseRadioProps } from '@chakra-ui/react'
import { type FunctionComponent, type ReactNode } from 'react'

import COLORS from '@/utils/Colors'

const RadioCard: FunctionComponent<
  UseRadioProps & { children?: ReactNode }
> = ({ ...props }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as='label' w='100%'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='16'
        borderColor={COLORS.tipTextColor}
        _checked={{
          borderColor: COLORS.primaryColor,
          borderWidth: '2px',
          _hover: {
            borderColor: COLORS.primaryColor,
          },
        }}
        _hover={{
          borderColor: COLORS.textColor,
        }}
        p={4}
      >
        {props?.children}
      </Box>
    </Box>
  )
}

export default RadioCard
