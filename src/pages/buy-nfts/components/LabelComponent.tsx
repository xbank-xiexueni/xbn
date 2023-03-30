import { Box, Flex, Heading, Skeleton, type BoxProps } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

const LabelComponent: FunctionComponent<
  BoxProps & { label: string; loading?: boolean; isEmpty?: boolean }
> = ({ label, children, loading, isEmpty, ...rest }) => {
  return (
    <Box
      borderBottomColor={'gray.2'}
      borderBottomWidth={1}
      mt={{
        md: '44px',
        sm: '40px',
        xs: '40px',
      }}
      pb={{ md: '44px', sm: '40px', xs: '40px' }}
      {...rest}
    >
      <Heading mb={5} fontSize={{ md: '24px', sm: '20px', xs: '20px' }}>
        {label}
      </Heading>

      {loading && <Skeleton h='100px' borderRadius={16} />}
      {!loading && isEmpty && (
        <Flex alignItems={'center'} justify='center' color='gray.3' py='24px'>
          No data yet...
        </Flex>
      )}
      {!loading && !isEmpty && children}
    </Box>
  )
}

export default LabelComponent
