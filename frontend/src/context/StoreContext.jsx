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

// Same as useStore(), but safe to call from components that render both
// inside a store page (Navbar/Footer showing store-specific info) and
// outside one (the same Navbar/Footer showing generic Happilee branding
// on the home page). Returns null instead of throwing when there's no store.
export function useOptionalStore() {
  return useContext(StoreContext);
}
