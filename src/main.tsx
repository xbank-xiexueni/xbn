import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PhotoProvider } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { BrowserRouter } from 'react-router-dom'

import '@/assets/iconfont/iconfont.js'
import { TransactionsProvider } from '@/context/TransactionContext'
import RootLayout from '@/layouts/RootLayout'
import theme from '@/themes'

import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
createRoot(rootElement as HTMLElement).render(
  <TransactionsProvider>
    <StrictMode>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <RootLayout>
            <PhotoProvider maskOpacity={0.4} bannerVisible={false} maskClosable>
              <App />
            </PhotoProvider>
          </RootLayout>
        </BrowserRouter>
      </ChakraProvider>
    </StrictMode>
  </TransactionsProvider>,
)
