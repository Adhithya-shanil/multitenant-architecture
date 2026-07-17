import { Link } from 'react-router-dom';
import Navbar from '../core/Navbar';
import Footer from '../core/Footer';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-medium text-[var(--color-text)]">Page not found</p>
        <p className="text-sm text-[var(--color-muted)]">
          Either this route doesn't exist, or it's coming in a later step.
        </p>
        <Link to="/" className="text-sm font-medium text-[var(--color-text)] underline">
          Back to home
        </Link>
      </div>
      <Footer />
    </>
  );
}
