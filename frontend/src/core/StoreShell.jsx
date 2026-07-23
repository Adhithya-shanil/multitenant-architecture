import { Link } from 'react-router-dom';
import { useStoreLoader } from '../hooks/useStoreLoader';
import { StoreContext } from '../context/StoreContext';
import ThemeProvider from '../theme/ThemeProvider';
import CartProvider from './cart/CartProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

// Every page scoped to a single store (product listing, cart, checkout...)
// shares this shell: fetch the store, show the loading animation, then
// provide StoreContext + the theme + a per-store cart to whatever page
// content is passed in as children. This is the one place that logic lives.
export default function StoreShell({ handle, children }) {
  const { store, isLoading, error } = useStoreLoader(handle);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner label={`Loading ${handle}...`} />
        <Footer />
      </>
    );
  }

  if (error || !store) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-lg font-medium text-[var(--color-text)]">Store "{handle}" not found</p>
          {error?.message && <p className="text-sm text-[var(--color-muted)]">{error.message}</p>}
          <Link to="/" className="text-sm font-medium text-[var(--color-text)] underline">
            Back to home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={store.theme} themeConfig={store.themeConfig}>
        <CartProvider storeHandle={store.handle}>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </ThemeProvider>
    </StoreContext.Provider>
  );
}
