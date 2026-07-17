import { useState } from 'react';
import { useCart } from './cart/CartContext';
import { useStore } from '../context/StoreContext';
import { getVerticalProductExtra } from '../verticals/registry';

// Generic metafields-style attribute renderer: a "size" select and a "dosage"
// text field don't share a shape, so instead of fixed columns each product
// carries an `attributes` array and this just formats whatever it finds.
// Attributes a vertical component already renders interactively (size,
// spice level, ...) are excluded here so they aren't shown twice.
function formatAttribute(attr) {
  switch (attr.type) {
    case 'boolean':
      return `${attr.label}: ${attr.value ? 'Yes' : 'No'}`;
    case 'multiselect':
      return attr.value?.length ? `${attr.label}: ${attr.value.join(', ')}` : `${attr.label}: ${attr.options.join(', ')}`;
    default:
      return `${attr.label}: ${attr.value}`;
  }
}

function computeLineId(productId, selections) {
  const entries = Object.entries(selections ?? {}).filter(
    ([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0),
  );
  if (entries.length === 0) return productId;
  entries.sort(([a], [b]) => a.localeCompare(b));
  return `${productId}::${JSON.stringify(entries)}`;
}

export default function ProductCard({ product }) {
  const { category } = useStore();
  const { items, addItem, updateQuantity } = useCart();
  const vertical = getVerticalProductExtra(category);

  const [selections, setSelections] = useState({});
  const [isReady, setIsReady] = useState(true);

  const lineId = computeLineId(product.id, selections);
  const cartItem = items.find((item) => item.lineId === lineId);

  const badgeAttributes = vertical
    ? product.attributes?.filter((attr) => !vertical.handledKeys.includes(attr.key))
    : product.attributes;

  function handleSelectionsChange(key, value) {
    setSelections((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div
      className="flex flex-col gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-4xl">{product.image}</div>
        <div className="text-right">
          <div className="text-lg font-semibold text-[var(--color-primary)]">
            {product.currency} {product.price}
          </div>
        </div>
      </div>
      <h3
        className="text-base font-semibold text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {product.name}
      </h3>
      <p className="text-sm text-[var(--color-muted)]">{product.description}</p>

      {badgeAttributes?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {badgeAttributes.map((attr) => (
            <span
              key={attr.key}
              className="rounded-[var(--radius-pill)] border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-muted)]"
            >
              {formatAttribute(attr)}
            </span>
          ))}
        </div>
      )}

      {vertical && (
        <vertical.Component
          attributes={product.attributes}
          selections={selections}
          onSelectionsChange={handleSelectionsChange}
          onReadyChange={setIsReady}
        />
      )}

      {cartItem ? (
        <div
          className="mt-1 flex items-center justify-between border border-[var(--color-border)] px-3 py-1.5"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          <button
            type="button"
            onClick={() => updateQuantity(lineId, cartItem.quantity - 1)}
            className="px-1 text-[var(--color-text)]"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-sm font-medium text-[var(--color-text)]">{cartItem.quantity} in cart</span>
          <button
            type="button"
            onClick={() => updateQuantity(lineId, cartItem.quantity + 1)}
            className="px-1 text-[var(--color-text)]"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={!isReady}
          onClick={() => addItem(product, 1, selections)}
          className="mt-1 bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          {isReady ? 'Add to Cart' : 'Complete the steps above to continue'}
        </button>
      )}
    </div>
  );
}
