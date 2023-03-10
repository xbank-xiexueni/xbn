import {
  Input,
  InputGroup,
  type InputProps,
  type ImageProps,
  InputLeftElement,
} from '@chakra-ui/react'

import { SvgComponent } from '@/components'

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
  // leftIcon,
  // leftIconProps,
  isInvalid,
  _focusVisible,
  // rightIcon,
  _placeholder,
  // rightIconProps,
  ...rest
}) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
        <SvgComponent svgId='icon-search' />
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
            isInvalid
              ? `var(--chakra-colors-red-1)`
              : `var(--chakra-colors-blue-1)`
          }`,
          ..._focusVisible,
        }}
        borderColor={isInvalid ? 'red.1' : 'gray.2'}
        _placeholder={{
          marginTop: 4,
          ..._placeholder,
        }}
      />
    </InputGroup>
  )
}

export default index
