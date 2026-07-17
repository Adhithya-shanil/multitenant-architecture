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

// A product plus a set of vertical selections (size, spice level, ...) is
// its own cart line - "Essential Crew Tee, size M" and "..., size L" are
// different lines, not the same one with a quantity of 2.
function computeLineId(productId, selections) {
  const entries = Object.entries(selections ?? {}).filter(
    ([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0),
  );
  if (entries.length === 0) return productId;
  entries.sort(([a], [b]) => a.localeCompare(b));
  return `${productId}::${JSON.stringify(entries)}`;
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

  function addItem(product, quantity = 1, selections = {}) {
    const lineId = computeLineId(product.id, selections);

    setItems((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency,
          image: product.image,
          quantity,
          selections,
        },
      ];
    });
  }

  function removeItem(lineId) {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }

  function updateQuantity(lineId, quantity) {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    setItems((prev) => prev.map((item) => (item.lineId === lineId ? { ...item, quantity } : item)));
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
