import { Link, useParams } from 'react-router-dom';
import StoreShell from '../core/StoreShell';
import { useStore } from '../context/StoreContext';
import { useCart } from '../core/cart/CartContext';
import { formatSelections } from '../core/cart/formatSelections';

function EmptyCart({ store }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1
        className="text-2xl font-bold text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Your cart is empty
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">Add something from {store.name} to get started.</p>
      <Link
        to={`/${store.handle}`}
        className="mt-6 inline-block bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary-contrast)]"
        style={{ borderRadius: 'var(--radius-pill)' }}
      >
        Browse {store.name}
      </Link>
    </main>
  );
}

function CartLineItem({ item, onIncrement, onDecrement, onRemove }) {
  const selectionsLabel = formatSelections(item.selections);

  return (
    <div
      className="flex items-center gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      <div className="text-3xl">{item.image}</div>
      <div className="flex-1">
        <p className="font-medium text-[var(--color-text)]">{item.name}</p>
        {selectionsLabel && <p className="text-xs text-[var(--color-muted)]">{selectionsLabel}</p>}
        <p className="text-sm text-[var(--color-muted)]">
          {item.currency} {item.price}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          aria-label="Decrease quantity"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)]"
        >
          −
        </button>
        <span className="w-6 text-center text-sm text-[var(--color-text)]">{item.quantity}</span>
        <button
          type="button"
          onClick={onIncrement}
          aria-label="Increase quantity"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)]"
        >
          +
        </button>
      </div>
      <button type="button" onClick={onRemove} className="text-xs text-[var(--color-muted)] underline">
        Remove
      </button>
    </div>
  );
}

function CartContent() {
  const store = useStore();
  const { items, updateQuantity, removeItem, subtotal, currency } = useCart();

  if (items.length === 0) {
    return <EmptyCart store={store} />;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1
        className="mb-6 text-2xl font-bold text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Your Cart
      </h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartLineItem
            key={item.lineId}
            item={item}
            onIncrement={() => updateQuantity(item.lineId, item.quantity + 1)}
            onDecrement={() => updateQuantity(item.lineId, item.quantity - 1)}
            onRemove={() => removeItem(item.lineId)}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <span className="text-lg font-semibold text-[var(--color-text)]">Subtotal</span>
        <span className="text-lg font-semibold text-[var(--color-primary)]">
          {currency} {subtotal}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/${store.handle}`}
          className="flex-1 border border-[var(--color-border)] px-5 py-3 text-center text-sm font-medium text-[var(--color-text)]"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          Continue Shopping
        </Link>
        <Link
          to={`/${store.handle}/checkout`}
          className="flex-1 bg-[var(--color-primary)] px-5 py-3 text-center text-sm font-medium text-[var(--color-primary-contrast)]"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}

export default function CartPage() {
  const { handle } = useParams();

  return (
    <StoreShell handle={handle}>
      <CartContent />
    </StoreShell>
  );
}
