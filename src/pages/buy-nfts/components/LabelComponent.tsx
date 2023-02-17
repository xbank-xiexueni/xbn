import { Box, Flex, Heading, Skeleton, type BoxProps } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

const LabelComponent: FunctionComponent<
  BoxProps & { label: string; loading?: boolean; isEmpty?: boolean }
> = ({ label, children, loading, isEmpty, ...rest }) => {
  return (
    <Box
      borderBottomColor={'gray.2'}
      borderBottomWidth={1}
      mt={'44px'}
      pb={'44px'}
      {...rest}
    >
      <Heading mb={5} size='lg'>
        {label}
      </Heading>

      {loading && <Skeleton h='100px' borderRadius={16} />}
      {!loading && isEmpty && (
        <Flex alignItems={'center'} justify='center' color='gray.3' py={6}>
          no data yet...
        </Flex>
      )}
      {!loading && !isEmpty && children}
    </Box>
  )
}

export default LabelComponent
