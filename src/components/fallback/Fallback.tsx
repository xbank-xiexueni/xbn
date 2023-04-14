import { Flex, Spinner } from '@chakra-ui/react'

const Fallback = () => {
  return (
    <Flex h='calc(100vh - 75px)' w='100%'>
      <Flex
        position={'absolute'}
        left={0}
        right={0}
        top={{ md: '80px', xs: '56px', sm: '56px' }}
        bottom={0}
        bg='rgba(27, 34, 44, 0.1)'
        borderRadius={4}
        justify={'center'}
        zIndex={10}
      >
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.1'
          color='blue.1'
          size='xl'
          mt={{ md: '80px', xs: '56px', sm: '56px' }}
        />
      </Flex>
    </Flex>
  )
}

export default Fallback
