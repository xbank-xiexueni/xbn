import { Button, Flex, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Index = () => {
  const navigate = useNavigate()
  return (
    <Flex
      my={20}
      justify='center'
      flexDirection={'column'}
      gap={10}
      alignItems={'center'}
    >
      <Heading>oops, Page not found</Heading>
      <Button variant={'primary'} h='40px' onClick={() => navigate('lend')}>
        Back to Index
      </Button>
    </Flex>
  )
}

export default Index
