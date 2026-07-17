import { createContext, useContext } from 'react';

// Holds the current store's identity + the two tokens ("category" and "theme")
// that the rest of the app (navbar, product list, theme provider, ...) reads
// from instead of re-fetching or re-deriving them.
export const StoreContext = createContext(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a <StoreContext.Provider>');
  }
  return ctx;
}
