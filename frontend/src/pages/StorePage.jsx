import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchStoreByHandle, fetchStoreProducts } from '../api/stores';
import { StoreContext } from '../context/StoreContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

export default function StorePage() {
  const { handle } = useParams();
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // This is the "first API call" for a storefront: its response carries the
  // category + theme tokens that drive everything else about how this page looks.
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setStore(null);

    fetchStoreByHandle(handle)
      .then((data) => {
        if (isMounted) setStore(data);
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

  // Second call, made once we know the store exists: the product listing for it.
  useEffect(() => {
    if (isLoading || error || !store) return;

    let isMounted = true;
    setProductsLoading(true);
    setProductsError(null);

    fetchStoreProducts(handle)
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((err) => {
        if (isMounted) setProductsError(err);
      })
      .finally(() => {
        if (isMounted) setProductsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [handle, isLoading, error, store]);

  if (isLoading) {
    return <LoadingSpinner label={`Loading ${handle}...`} />;
  }

  if (error || !store) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-medium text-slate-900">Store "{handle}" not found</p>
        {error?.message && <p className="text-sm text-slate-500">{error.message}</p>}
        <Link to="/" className="text-sm font-medium text-slate-700 underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={store}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8 flex items-center gap-4">
          <div className="text-5xl">{store.logoEmoji}</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{store.name}</h1>
            <p className="text-slate-500">{store.tagline}</p>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            category: {store.category}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">theme: {store.theme}</span>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Products</h2>

          {productsLoading && <LoadingSpinner label="Loading products..." />}

          {!productsLoading && productsError && (
            <p className="text-sm text-red-600">Failed to load products: {productsError.message}</p>
          )}

          {!productsLoading && !productsError && products.length === 0 && (
            <p className="text-sm text-slate-400">No products found for this store.</p>
          )}

          {!productsLoading && !productsError && products.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </StoreContext.Provider>
  );
}
