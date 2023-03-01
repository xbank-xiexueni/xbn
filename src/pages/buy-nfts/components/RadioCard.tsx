import { Flex, type FlexProps } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

type RadioCardProps = {
  isActive?: boolean
  isDisabled?: boolean
}

const RadioCard: FunctionComponent<FlexProps & RadioCardProps> = ({
  children,
  isActive,
  isDisabled,
  onClick,
  ...props
}) => {
  return (
    <Flex
      flexDir={'column'}
      h='136px'
      justifyContent='space-between'
      onClick={isDisabled ? () => undefined : onClick}
      {...props}
      w='100%'
      cursor='pointer'
      borderWidth={1}
      borderRadius='16'
      borderColor={isActive ? 'blue.1' : 'gray.1'}
      _hover={{
        borderColor: isActive && !isDisabled ? 'blue.1' : 'black.1',
      }}
      bg={isDisabled ? 'gray.2' : 'white'}
      p={4}
    >
      {children}
    </Flex>
  )
}

export default RadioCard
