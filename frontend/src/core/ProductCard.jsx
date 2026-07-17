import { useCart } from './cart/CartContext';

// Generic metafields-style attribute renderer: a "size" select and a "dosage"
// text field don't share a shape, so instead of fixed columns each product
// carries an `attributes` array and this just formats whatever it finds.
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

export default function ProductCard({ product }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.productId === product.id);

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

      {product.attributes?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.attributes.map((attr) => (
            <span
              key={attr.key}
              className="rounded-[var(--radius-pill)] border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-muted)]"
            >
              {formatAttribute(attr)}
            </span>
          ))}
        </div>
      )}

      {cartItem ? (
        <div
          className="mt-1 flex items-center justify-between border border-[var(--color-border)] px-3 py-1.5"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          <button
            type="button"
            onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
            className="px-1 text-[var(--color-text)]"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-sm font-medium text-[var(--color-text)]">{cartItem.quantity} in cart</span>
          <button
            type="button"
            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
            className="px-1 text-[var(--color-text)]"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => addItem(product)}
          className="mt-1 bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)]"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
