import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './CartContext';

// Carts are scoped per store handle (a cart is tenant data, same as
// everything else here) and persisted to localStorage so it survives
// navigating between the store page, the cart page and a page refresh -
// but adding something at store-a never leaks into store-b's cart.
function storageKey(storeHandle) {
  return `happilee_cart_${storeHandle}`;
}

function readStoredItems(storeHandle) {
  try {
    const raw = localStorage.getItem(storageKey(storeHandle));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function CartProvider({ storeHandle, children }) {
  const [items, setItems] = useState(() => readStoredItems(storeHandle));

  // Re-sync if the shell is reused for a different store handle.
  useEffect(() => {
    setItems(readStoredItems(storeHandle));
  }, [storeHandle]);

  useEffect(() => {
    localStorage.setItem(storageKey(storeHandle), JSON.stringify(items));
  }, [storeHandle, items]);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency,
          image: product.image,
          quantity,
        },
      ];
    });
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const currency = items[0]?.currency ?? 'INR';

  const value = { items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, currency };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
