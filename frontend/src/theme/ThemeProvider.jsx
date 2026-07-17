import { getTheme } from './themes';

// Applies a theme's CSS variables to a wrapping element. Nothing below this
// reads JS theme state directly - everything just uses var(--color-primary),
// var(--radius-card), etc, so swapping `theme` here is enough to re-skin
// every component underneath without touching their code.
export default function ThemeProvider({ theme, children, className = '' }) {
  const { vars } = getTheme(theme);

  return (
    <div
      data-theme={theme}
      className={`min-h-screen ${className}`}
      style={{
        ...vars,
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {children}
    </div>
  );
}
