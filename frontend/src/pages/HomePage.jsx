import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStores } from '../api/stores';
import { getCategoryConfig } from '../api/configCache';
import LoadingSpinner from '../core/LoadingSpinner';
import Navbar from '../core/Navbar';
import Footer from '../core/Footer';

function StoreCard({ store, categoryLabel }) {
  return (
    <Link
      to={`/${store.handle}`}
      className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="text-4xl">{store.logoEmoji}</div>
      <h2 className="text-lg font-semibold text-[var(--color-text)]">{store.name}</h2>
      <p className="text-sm text-[var(--color-muted)]">{store.tagline}</p>
      <div className="mt-2 flex gap-2 text-xs font-medium">
        <span className="rounded-[var(--radius-pill)] bg-[var(--color-bg)] px-2.5 py-1 text-[var(--color-muted)]">
          {categoryLabel}
        </span>
        <span className="rounded-[var(--radius-pill)] bg-[var(--color-bg)] px-2.5 py-1 text-[var(--color-muted)]">
          {store.theme}
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [stores, setStores] = useState([]);
  const [categoryLabels, setCategoryLabels] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchStores()
      .then(async (data) => {
        // Only a handful of distinct categories across all stores - fetch
        // each one once (via the cache) instead of once per store.
        const uniqueCategories = [...new Set(data.map((store) => store.category))];
        const configs = await Promise.all(uniqueCategories.map(getCategoryConfig));
        if (!isMounted) return;
        setStores(data);
        setCategoryLabels(Object.fromEntries(uniqueCategories.map((category, i) => [category, configs[i].label])));
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner label="Loading storefronts..." />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center text-red-600">
          Failed to load stores: {error}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Happilee</h1>
          <p className="mt-2 text-[var(--color-muted)]">
            One storefront codebase, {stores.length} stores, 3 categories, 3 themes. Pick one to see it in action.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} categoryLabel={categoryLabels[store.category]} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
