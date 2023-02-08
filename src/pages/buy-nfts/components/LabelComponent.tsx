import { Box, Heading, Skeleton, type BoxProps } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

const LabelComponent: FunctionComponent<
  BoxProps & { label: string; loading?: boolean }
> = ({ label, children, loading, ...rest }) => {
  return (
    <Box borderBottom='1px solid #E9EDF3' mt={'44px'} pb={'44px'} {...rest}>
      <Heading mb={5} size='lg'>
        {label}
      </Heading>
      {loading ? <Skeleton h='100px' borderRadius={16} /> : children}
    </Box>
  )
}

export default LabelComponent
