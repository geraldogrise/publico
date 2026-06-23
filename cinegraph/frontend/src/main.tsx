import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as UrqlProvider } from 'urql';
import './index.css';
import { App } from './App.tsx';
import { urqlClient } from './lib/urql';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UrqlProvider value={urqlClient}>
      <App />
    </UrqlProvider>
  </StrictMode>,
);
