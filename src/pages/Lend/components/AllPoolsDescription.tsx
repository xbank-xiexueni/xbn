import { Box, Flex, Heading, HStack, Text, Image } from '@chakra-ui/react'
import { type ReactElement, type FunctionComponent } from 'react'

import COLORS from '@/utils/Colors'

const AllPoolsDescription: FunctionComponent<{
  data: {
    titleImage?: string
    title?: string | ReactElement
    description?: string | ReactElement
    img?: string
    keys?: {
      value: string | ReactElement
      label: string | ReactElement
    }[]
  }
}> = ({ data: { title = '', description = '', img = '', keys = [] } }) => {
  return (
    <Flex
      justify={{
        sm: 'center',
        md: 'space-between',
      }}
      alignItems='center'
      wrap='wrap'
    >
      <Box
        maxW={{
          md: '40%',
          xl: '50%',
          sm: '100%',
        }}
      >
        {typeof title === 'string' ? (
          <Heading fontSize={'6xl'}>{title}</Heading>
        ) : (
          title
        )}
        {typeof description === 'string' ? (
          <Text
            color={COLORS.secondaryTextColor}
            mt={2}
            mb={10}
            fontSize={'xl'}
            fontWeight='medium'
          >
            {description}
          </Text>
        ) : (
          description
        )}

        <HStack spacing={10}>
          {keys.map(({ label, value }) => (
            <Box key={`${label}`}>
              {typeof value === 'string' ? (
                <Heading fontSize={'3xl'}>{value}</Heading>
              ) : (
                value
              )}
              {typeof label === 'string' ? (
                <Text color={COLORS.infoTextColor}>{label}</Text>
              ) : (
                label
              )}
            </Box>
          ))}
        </HStack>
      </Box>
      <Image
        src={img}
        w={{
          sm: '100%',
          md: '440px',
        }}
      />
    </Flex>
  )
}

export default AllPoolsDescription
