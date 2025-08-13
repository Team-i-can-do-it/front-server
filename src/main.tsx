import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import QueryClientProviders from './providers/QueryClientProvider.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProviders>
  </StrictMode>,
);
