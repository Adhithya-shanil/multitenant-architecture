import { useEffect, useState } from 'react';
import { fetchStoreProducts } from '../api/stores';
import { useStore } from '../context/StoreContext';
import LoadingSpinner from '../core/LoadingSpinner';
import ProductCard from '../core/ProductCard';

export default function StoreProducts({ handle }) {
  const store = useStore();
  const { categoryConfig } = store;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchStoreProducts(handle)
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [handle]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 flex items-center gap-4">
        <div className="text-5xl">{store.logoEmoji}</div>
        <div>
          <h1
            className="text-2xl font-bold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {store.name}
          </h1>
          <p className="text-[var(--color-muted)]">{store.tagline}</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-[var(--radius-pill)] bg-[var(--color-primary)] px-2.5 py-1 text-[var(--color-primary-contrast)]">
          category: {store.category}
        </span>
        <span className="rounded-[var(--radius-pill)] border border-[var(--color-border)] px-2.5 py-1 text-[var(--color-muted)]">
          theme: {store.theme}
        </span>
      </div>

      <section className="mt-10">
        <h2
          className="mb-4 text-lg font-semibold text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {categoryConfig.productsSectionTitle}
        </h2>

        {isLoading && <LoadingSpinner label="Loading products..." />}

        {!isLoading && error && (
          <p className="text-sm text-red-600">Failed to load products: {error.message}</p>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="text-sm text-[var(--color-muted)]">No products found for this store.</p>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
