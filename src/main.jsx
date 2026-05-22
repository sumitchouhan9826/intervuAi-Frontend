import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';
import './index.css';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_KEY} afterSignOutUrl="/sign-in">
      <AppRouter />
      <Toaster position="top-right" toastOptions={{ style: { background: '#0A0A0B', color: '#fff', borderRadius: '12px', fontSize: '14px' } }} />
    </ClerkProvider>
  </React.StrictMode>
);
