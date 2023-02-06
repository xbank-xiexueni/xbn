import {
  Input,
  InputGroup,
  Image,
  type InputProps,
  type ImageProps,
} from '@chakra-ui/react'

import COLORS from '@/utils/Colors'

import IconSearch from '@/assets/icon/icon-search.svg'

import type { FunctionComponent } from 'react'

const index: FunctionComponent<
  InputProps & {
    icon?: string
    iconProps?: ImageProps
  }
> = ({
  placeholder,
  borderRadius,
  h,
  icon,
  iconProps,

  ...rest
}) => {
  return (
    <InputGroup pos={'relative'}>
      <Image
        src={icon || IconSearch}
        pos={'absolute'}
        top={'14px'}
        left={3}
        h={6}
        {...iconProps}
      />
      <Input
        placeholder={placeholder || 'Search...'}
        {...rest}
        pl={10}
        fontSize={'md'}
        borderRadius={borderRadius || '48px'}
        h={h || '42px'}
        _focusVisible={{
          boxShadow: `0 0 0 1px ${COLORS.primaryColor}`,
          borderColor: COLORS.primaryColor,
        }}
      />
    </InputGroup>
  )
}

export default index
