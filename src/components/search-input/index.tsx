import {
  Input,
  InputGroup,
  Image,
  type InputProps,
  type ImageProps,
  InputLeftElement,
} from '@chakra-ui/react'

import COLORS from '@/utils/Colors'

import IconSearch from '@/assets/icon/icon-search.svg'

import type { FunctionComponent } from 'react'

const index: FunctionComponent<
  InputProps & {
    leftIcon?: string
    leftIconProps?: ImageProps
    rightIcon?: string
    rightIconProps?: ImageProps
  }
> = ({
  placeholder,
  borderRadius,
  h,
  leftIcon,
  leftIconProps,
  isInvalid,
  _focusVisible,
  rightIcon,
  rightIconProps,
  ...rest
}) => {
  return (
    <InputGroup pos={'relative'}>
      <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
        <Image src={IconSearch} />
      </InputLeftElement>
      <Input
        {...rest}
        placeholder={placeholder || 'Search...'}
        pl={10}
        fontSize={'md'}
        borderRadius={borderRadius || '48px'}
        h={h || '42px'}
        isInvalid={isInvalid}
        _focusVisible={{
          boxShadow: `0 0 0 1px ${
            isInvalid ? COLORS.errorColor : COLORS.primaryColor
          }`,
          ..._focusVisible,
        }}
        borderColor={isInvalid ? COLORS.errorColor : COLORS.borderColor}
      />
    </InputGroup>
  )
}

export default index
