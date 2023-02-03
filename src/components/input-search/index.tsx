import { Input, InputGroup, Image, type InputProps } from '@chakra-ui/react'

import COLORS from '@/utils/Colors'

import IconSearch from '@/assets/icon/icon-search.svg'

import type { FunctionComponent } from 'react'

const index: FunctionComponent<InputProps> = ({ placeholder, ...rest }) => {
  return (
    <InputGroup pos={'relative'}>
      <Image src={IconSearch} pos={'absolute'} top={'14px'} left={3} />
      <Input
        placeholder={placeholder || 'Search...'}
        {...rest}
        pl={10}
        fontSize={'md'}
        borderRadius={'48px'}
        h={'42px'}
        _focusVisible={{
          boxShadow: `0 0 0 1px ${COLORS.primaryColor}`,
          borderColor: COLORS.primaryColor,
        }}
      />
    </InputGroup>
  )
}

export default index
