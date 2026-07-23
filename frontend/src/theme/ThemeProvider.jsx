// Applies a theme's CSS variables to a wrapping element. Nothing below this
// reads JS theme state directly - everything just uses var(--color-primary),
// var(--radius-card), etc, so swapping `themeConfig` here is enough to
// re-skin every component underneath without touching their code.
// `themeConfig` (the { name, vars } dictionary) comes from the store API
// response - the frontend no longer keeps its own copy of the theme table.
export default function ThemeProvider({ theme, themeConfig, children, className = '' }) {
  const { vars } = themeConfig;

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
