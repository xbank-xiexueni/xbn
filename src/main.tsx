import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { TransactionsProvider } from './context/TransactionContext';

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement as HTMLElement).render(
  <TransactionsProvider>
    <React.StrictMode>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </React.StrictMode>
  </TransactionsProvider>
);
