import { Box, type BoxProps } from '@chakra-ui/react'
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
      <svg className='icon' aria-hidden='true' fontSize={svgSize}>
        <use xlinkHref={`#${svgId}`} />
      </svg>
    </Box>
  )
}

export default SvgComponent
