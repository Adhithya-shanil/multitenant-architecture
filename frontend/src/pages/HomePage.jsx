import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStores } from '../api/stores';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORY_LABEL = {
  food: 'Food',
  clothes: 'Clothes',
  pharma: 'Pharma',
};

function StoreCard({ store }) {
  return (
    <Link
      to={`/${store.handle}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="text-4xl">{store.logoEmoji}</div>
      <h2 className="text-lg font-semibold text-slate-900">{store.name}</h2>
      <p className="text-sm text-slate-500">{store.tagline}</p>
      <div className="mt-2 flex gap-2 text-xs font-medium">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
          {CATEGORY_LABEL[store.category] ?? store.category}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{store.theme}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchStores()
      .then((data) => {
        if (isMounted) setStores(data);
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
    return <LoadingSpinner label="Loading storefronts..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-600">
        Failed to load stores: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Happilee</h1>
        <p className="mt-2 text-slate-500">
          One storefront codebase, {stores.length} stores, 3 categories, 3 themes. Pick one to see it in action.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}
