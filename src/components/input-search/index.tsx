import { Input, InputGroup, Image, type InputProps } from '@chakra-ui/react'

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
      />
    </InputGroup>
  )
}

export default index
