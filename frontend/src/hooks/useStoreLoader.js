import { useEffect, useState } from 'react';
import { fetchStoreByHandle } from '../api/stores';

// Shared by every page that needs "the store behind this handle" - StorePage
// and CartPage (and CheckoutPage later) all hit the same first API this way
// instead of duplicating the fetch/loading/error dance.
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

  return { store, isLoading, error };
}
