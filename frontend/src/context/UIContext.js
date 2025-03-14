import { createContext, useState, useContext, useCallback } from 'react';
import { Alert, Backdrop, CircularProgress } from '@mui/material';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const showLoading = useCallback(() => setLoading(true), []);
  const hideLoading = useCallback(() => setLoading(false), []);
  const showError = useCallback((message) => setError(message), []);
  const clearError = useCallback(() => setError(null), []);

  return (
    <UIContext.Provider value={{ showLoading, hideLoading, showError, clearError }}>
      {loading && (
        <Backdrop open={true} sx={{ zIndex: 9999 }}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
          sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}
        >
          {error}
        </Alert>
      )}
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};