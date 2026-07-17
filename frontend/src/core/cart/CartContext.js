import { createContext, useContext } from 'react';

export const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return ctx;
}

// Safe for components (like Navbar) that render both inside a store's
// CartProvider and outside one (the home page, which has no active cart).
export function useOptionalCart() {
  return useContext(CartContext);
}
