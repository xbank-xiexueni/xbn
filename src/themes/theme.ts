import { extendTheme } from '@chakra-ui/react'

import breakpoints from './breakpoints'
import components from './components'
import styles from './styles'

const theme = extendTheme({ breakpoints, styles, components })

export default theme
