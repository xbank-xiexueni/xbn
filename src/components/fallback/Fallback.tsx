import { Flex, Spinner } from '@chakra-ui/react'

const Fallback = () => {
  return (
    <Flex h='calc(100vh - 75px)' w='100%'>
      <Flex
        position={'absolute'}
        left={0}
        right={0}
        top={20}
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
          mt={20}
        />
      </Flex>
    </Flex>
  )
}

export default Fallback
