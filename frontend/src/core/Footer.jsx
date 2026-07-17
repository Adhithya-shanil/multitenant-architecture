import { useOptionalStore } from '../context/StoreContext';
import { getCategoryConfig } from '../config/categoryConfig';

export default function Footer() {
  const store = useOptionalStore();
  const config = store ? getCategoryConfig(store.category) : null;

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-[var(--color-muted)]">
        {config ? (
          <p>{config.footerNote}</p>
        ) : (
          <p>Happilee - a prototype multi-tenant, multi-vertical storefront architecture. No real transactions.</p>
        )}
      </div>
    </footer>
  );
}
