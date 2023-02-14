import { Flex } from '@chakra-ui/react'

import { LoadingComponent } from '..'

const Fallback = () => {
  return (
    <Flex position={'relative'} h='90vh' top='74px' w='100vw'>
      <LoadingComponent loading />
    </Flex>
  )
}

export default Fallback
