import { Flex, type FlexProps } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

type RadioCardProps = {
  isActive?: boolean
}

const RadioCard: FunctionComponent<FlexProps & RadioCardProps> = ({
  children,
  isActive,
  ...props
}) => {
  return (
    <Flex
      flexDir={'column'}
      h='136px'
      justifyContent='space-between'
      {...props}
      w='100%'
      cursor='pointer'
      borderWidth={1}
      borderRadius='16'
      borderColor={isActive ? 'blue.1' : 'gray.1'}
      _hover={{
        borderColor: isActive ? 'blue.1' : 'black.1',
      }}
      p={4}
    >
      {children}
    </Flex>
  )
}

export default RadioCard
