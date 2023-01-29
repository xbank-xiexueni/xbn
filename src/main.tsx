import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { TransactionsProvider } from './context/TransactionContext'
import './index.css'

const rootElement = document.getElementById('root')
createRoot(rootElement as HTMLElement).render(
  <TransactionsProvider>
    <StrictMode>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </StrictMode>
  </TransactionsProvider>,
)
