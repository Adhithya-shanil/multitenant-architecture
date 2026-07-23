import { useEffect, useState } from 'react';
import { fetchStoreByHandle } from '../api/stores';
import { getThemeConfig, getCategoryConfig } from '../api/configCache';

// Shared by every page that needs "the store behind this handle" - StorePage
// and CartPage (and CheckoutPage later) all hit the same first API this way
// instead of duplicating the fetch/loading/error dance.
//
// The store record only carries `category`/`theme` tokens - this resolves
// them via the cached config endpoints and merges the result onto the store
// object, so everything downstream (Navbar, Footer, ProductCard, ...) can
// keep reading `store.categoryConfig`/`store.themeConfig` without knowing
// they were fetched separately. Since there are only a handful of distinct
// themes/categories, the cache means visiting a second store that shares one
// never re-fetches it.
export function useStoreLoader(handle) {
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setStore(null);

    fetchStoreByHandle(handle)
      .then(async (baseStore) => {
        const [themeConfig, categoryConfig] = await Promise.all([
          getThemeConfig(baseStore.theme),
          getCategoryConfig(baseStore.category),
        ]);
        if (isMounted) setStore({ ...baseStore, themeConfig, categoryConfig });
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

  return { store, isLoading, error };
}
