import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StoreShell from '../core/StoreShell';
import { useStore } from '../context/StoreContext';
import { useCart } from '../core/cart/CartContext';
import { formatSelections } from '../core/cart/formatSelections';

const PAYMENT_METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'cod', label: 'Cash on Delivery' },
];

function generateOrderId() {
  return `HAP-${Date.now().toString(36).toUpperCase()}`;
}

function OrderSummary({ items, subtotal, currency }) {
  return (
    <div
      className="flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      <h2 className="text-base font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
        Order Summary
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const selectionsLabel = formatSelections(item.selections);
          return (
            <div key={item.lineId} className="flex items-center justify-between text-sm text-[var(--color-text)]">
              <span>
                {item.name}
                {selectionsLabel && <span className="text-[var(--color-muted)]"> ({selectionsLabel})</span>} ×{' '}
                {item.quantity}
              </span>
              <span className="text-[var(--color-muted)]">
                {item.currency} {item.price * item.quantity}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-base font-semibold text-[var(--color-text)]">
        <span>Total</span>
        <span className="text-[var(--color-primary)]">
          {currency} {subtotal}
        </span>
      </div>
    </div>
  );
}

function OrderConfirmation({ store, order }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <div className="text-5xl">✅</div>
      <h1 className="mt-4 text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
        Order placed!
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Thanks for shopping at {store.name}. This is a prototype - nothing was actually charged.
      </p>

      <div
        className="mt-6 flex flex-col gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left"
        style={{ borderRadius: 'var(--radius-card)' }}
      >
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Order ID</span>
          <span className="font-medium text-[var(--color-text)]">{order.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Paid via</span>
          <span className="font-medium text-[var(--color-text)] capitalize">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Total</span>
          <span className="font-medium text-[var(--color-primary)]">
            {order.currency} {order.total}
          </span>
        </div>
      </div>

      <Link
        to={`/${store.handle}`}
        className="mt-8 inline-block bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary-contrast)]"
        style={{ borderRadius: 'var(--radius-pill)' }}
      >
        Back to {store.name}
      </Link>
    </main>
  );
}

function CheckoutContent() {
  const store = useStore();
  const { items, subtotal, currency, clearCart } = useCart();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState(null);

  if (order) {
    return <OrderConfirmation store={store} order={order} />;
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Nothing to check out
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">Your cart is empty.</p>
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

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    // Prototype only: fake a payment round trip, then clear this store's cart.
    const placedOrder = { id: generateOrderId(), paymentMethod, total: subtotal, currency };
    setTimeout(() => {
      clearCart();
      setOrder(placedOrder);
      setIsSubmitting(false);
    }, 800);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          style={{ borderRadius: 'var(--radius-card)' }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text)]" htmlFor="checkout-name">
              Full name
            </label>
            <input
              id="checkout-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
              style={{ borderRadius: 'var(--radius-pill)' }}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text)]" htmlFor="checkout-address">
              Delivery address
            </label>
            <textarea
              id="checkout-address"
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={3}
              className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
              style={{ borderRadius: 'var(--radius-card)' }}
              placeholder="221B Baker Street..."
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-[var(--color-text)]">Payment method</legend>
            <div className="flex flex-wrap gap-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.value;
                return (
                  <label
                    key={method.value}
                    className="flex cursor-pointer items-center gap-2 border border-[var(--color-border)] px-3 py-2 text-sm"
                    style={{
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                      color: isSelected ? 'var(--color-primary-contrast)' : 'var(--color-text)',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method.value)}
                      className="hidden"
                    />
                    {method.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-primary-contrast)] disabled:opacity-60"
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            {isSubmitting ? 'Placing order...' : `Pay ${currency} ${subtotal}`}
          </button>
        </form>

        <OrderSummary items={items} subtotal={subtotal} currency={currency} />
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  const { handle } = useParams();

  return (
    <StoreShell handle={handle}>
      <CheckoutContent />
    </StoreShell>
  );
}
