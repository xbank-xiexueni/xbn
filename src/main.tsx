import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'
import { ChakraProvider, Heading, Spinner } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PhotoProvider } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { BrowserRouter } from 'react-router-dom'
import 'video-react/dist/video-react.css' // import css

import '@/assets/iconfont/iconfont.js'
import { TransactionsProvider } from '@/context/TransactionContext'
import RootLayout from '@/layouts/RootLayout'
import theme from '@/themes'

import App from './App'
import { TOAST_OPTION_CONFIG } from './constants'
import './index.css'

const abortController = new AbortController()
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_BASE_URL}/lending/query`,
  fetchOptions: {
    mode: 'cors',
    signal: abortController.signal,
  },
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
})
const rootElement = document.getElementById('root')
createRoot(rootElement as HTMLElement).render(
  <StrictMode>
    <ApolloProvider client={client}>
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
                photoClosable
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
    </ApolloProvider>
  </StrictMode>,
)
