import React from 'react';
import ReactDOM from 'react-dom';
import WalletApp from './WalletApp';
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={client}>
    <WalletApp />
  </QueryClientProvider>
  , document.getElementById('root')
);