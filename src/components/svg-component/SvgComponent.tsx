import { Box, type BoxProps, chakra } from '@chakra-ui/react'
import { type FunctionComponent } from 'react'

const SvgComponent: FunctionComponent<
  { svgId: string; svgSize?: string } & BoxProps
> = ({
  svgId,
  // h,
  // w,
  // height,
  // width,
  svgSize,
  ...rest
}) => {
  return (
    <Box {...rest}>
      <chakra.svg className='icon' aria-hidden='true' fontSize={svgSize}>
        <chakra.use xlinkHref={`#${svgId}`} />
      </chakra.svg>
    </Box>
  )
}

export default SvgComponent
