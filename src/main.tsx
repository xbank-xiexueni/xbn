import { ChakraProvider, Heading, Spinner } from '@chakra-ui/react'
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
import { TOAST_OPTION_CONFIG } from './constants'
import './index.css'

const rootElement = document.getElementById('root')
createRoot(rootElement as HTMLElement).render(
  <StrictMode>
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: { ...TOAST_OPTION_CONFIG },
      }}
    >
      <TransactionsProvider>
        <BrowserRouter>
          <RootLayout>
            <PhotoProvider
              maskOpacity={0.4}
              bannerVisible={false}
              maskClosable
              loadingElement={<Spinner colorScheme={'blue'} color='blue.1' />}
              brokenElement={
                <Heading color={'gray.1'}>something went wrong...</Heading>
              }
            >
              <App />
            </PhotoProvider>
          </RootLayout>
        </BrowserRouter>
      </TransactionsProvider>
    </ChakraProvider>
  </StrictMode>,
)
