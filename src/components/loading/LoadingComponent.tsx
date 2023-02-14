import { Flex, Spinner } from '@chakra-ui/react'

const Index = ({ loading }: { loading: boolean }) => {
  if (!loading) {
    return null
  }
  return (
    <Flex
      position={'absolute'}
      left={0}
      right={0}
      top={0}
      bottom={0}
      bg='rgba(0,0,0,.1)'
      borderRadius={4}
      justify={'center'}
      zIndex={10}
    >
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.1'
        size='xl'
        mt={20}
      />
    </Flex>
  )
}

export default Index
