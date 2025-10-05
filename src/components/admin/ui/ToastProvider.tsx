'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 3000,
        style: {
          background: '#ffffff',
          color: '#1a1a1a',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px 20px',
          fontSize: '14px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
          maxWidth: '420px',
        },

        // Success toast styling (academic green)
        success: {
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#065f46',
            border: '1px solid #10b981',
            borderLeft: '4px solid #10b981',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },

        // Error toast styling (academic red)
        error: {
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#991b1b',
            border: '1px solid #ef4444',
            borderLeft: '4px solid #ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },

        // Loading toast styling (academic blue)
        loading: {
          style: {
            background: '#ffffff',
            color: '#1e40af',
            border: '1px solid #3b82f6',
            borderLeft: '4px solid #3b82f6',
          },
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
