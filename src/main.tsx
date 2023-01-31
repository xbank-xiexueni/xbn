import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { TransactionsProvider } from './context/TransactionContext'
import './index.css'
import RootLayout from './layouts/RootLayout'
import COLORS from './utils/Colors'

const breakpoints = {
  sm: '345px',
  md: '768px',
  lg: '968px',
  xl: '1400px',
  '2xl': '1400px',
}

const styles = {
  global: {
    'html, body': {
      color: COLORS.textColor,
      fontFamily: 'HarmonyOS',
    },
    a: {
      color: COLORS.primaryColor,
    },
  },
}

const ComponentStyle = {
  Button: {
    // // 1. We can update the base styles
    baseStyle: {
      fontWeight: 'bold', // Normally, it is "semibold"
      borderRadius: '50px',
    },
    // // 2. We can add a new button size or extend existing
    // sizes: {
    //   xl: {
    //     h: '56px',
    //     fontSize: 'lg',
    //     px: '32px',
    //   },
    // },
    // 3. We can add a new visual variant
    variants: {
      secondary: {
        bg: COLORS.secondaryColor,
        color: COLORS.primaryColor,
        _hover: {
          opacity: 0.8,
        },
      },
      primary: {
        bg: COLORS.primaryColor,
        color: 'white',
        _hover: {
          opacity: 0.5,
        },
      },
      link: {
        color: COLORS.primaryColor,
      },
      outline: {
        borderColor: COLORS.primaryColor,
        color: COLORS.primaryColor,
      },
      // // 5. We can add responsive variants
      // sm: {
      //   bg: 'teal.500',
      //   fontSize: 'md',
      // },
    },
    defaultProps: {
      size: 'md', // default is md
    },
  },
}
const theme = extendTheme({ breakpoints, styles, components: ComponentStyle })
const rootElement = document.getElementById('root')
createRoot(rootElement as HTMLElement).render(
  <TransactionsProvider>
    <StrictMode>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <RootLayout>
            <App />
          </RootLayout>
        </BrowserRouter>
      </ChakraProvider>
    </StrictMode>
  </TransactionsProvider>,
)
