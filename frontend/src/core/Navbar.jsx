import { Link } from 'react-router-dom';
import { useOptionalStore } from '../context/StoreContext';
import { useOptionalCart } from './cart/CartContext';

// One Navbar, used on the home page and on every store page. It never
// branches on category with if/else - it just reads whatever the current
// store (if any) sent back as its categoryConfig.
export default function Navbar() {
  const store = useOptionalStore();
  const cart = useOptionalCart();
  const config = store ? store.categoryConfig : null;
  const itemCount = cart?.itemCount ?? 0;

  const cartBadge = (
    <span className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text)]">
      <span>🛒</span>
      <span>{itemCount}</span>
    </span>
  );

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-2 text-[var(--color-text)]">
          <span className="text-2xl">{store ? store.logoEmoji : '🛍️'}</span>
          <span className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {store ? store.name : 'Happilee'}
          </span>
        </Link>

        {config && (
          <nav className="hidden items-center gap-5 text-sm text-[var(--color-muted)] sm:flex">
            {config.navLinks.map((link) => (
              <span key={link} className="cursor-default">
                {link}
              </span>
            ))}
          </nav>
        )}

        {store ? (
          <Link to={`/${store.handle}/cart`} aria-label="View cart">
            {cartBadge}
          </Link>
        ) : (
          cartBadge
        )}
      </div>
    </header>
  );
}
