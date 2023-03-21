import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

import type { FunctionComponent } from 'react'

type NotFoundProps = {
  title?: string
  backTo?: string
}
const NotFound: FunctionComponent<NotFoundProps> = ({
  title = 'Page not found',
  backTo = '/xlending/',
}) => {
  const navigate = useNavigate()
  return (
    <Alert
      status='error'
      variant='subtle'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      borderRadius={16}
      py={8}
    >
      <AlertIcon boxSize='40px' mr={0} />
      <AlertTitle mt={4} mb={1} fontSize='lg'>
        {title}
      </AlertTitle>
      <AlertDescription maxWidth='lg' my={5}>
        Please contact us if you meet an invalid operation: help@xbank.plus
      </AlertDescription>
      <Button
        onClick={() => {
          navigate(backTo)
        }}
      >
        Back
      </Button>
    </Alert>
  )
}

export default NotFound
