// Each theme is just a bag of CSS custom properties. Adding a "theme4" later
// means adding an entry here - no component code changes required, because
// every component reads colors/radius/fonts through var(--...) instead of
// hardcoded Tailwind color classes.
export const THEMES = {
  theme1: {
    name: 'Warm',
    vars: {
      '--color-bg': '#fdf6ec',
      '--color-surface': '#ffffff',
      '--color-primary': '#c2521a',
      '--color-primary-contrast': '#ffffff',
      '--color-text': '#3a2c22',
      '--color-muted': '#8a7566',
      '--color-border': '#eadfce',
      '--radius-card': '1.25rem',
      '--radius-pill': '999px',
      '--font-heading': 'Georgia, "Times New Roman", serif',
      '--font-body': 'system-ui, -apple-system, sans-serif',
    },
  },
  theme2: {
    name: 'Bold',
    vars: {
      '--color-bg': '#0f1030',
      '--color-surface': '#181a45',
      '--color-primary': '#ff5d8f',
      '--color-primary-contrast': '#0f1030',
      '--color-text': '#f5f4ff',
      '--color-muted': '#a9a8d1',
      '--color-border': '#2c2e63',
      '--radius-card': '0.5rem',
      '--radius-pill': '0.375rem',
      '--font-heading': '"Arial Black", Arial, sans-serif',
      '--font-body': 'system-ui, -apple-system, sans-serif',
    },
  },
  theme3: {
    name: 'Minimal',
    vars: {
      '--color-bg': '#fafafa',
      '--color-surface': '#ffffff',
      '--color-primary': '#141414',
      '--color-primary-contrast': '#ffffff',
      '--color-text': '#141414',
      '--color-muted': '#767676',
      '--color-border': '#e5e5e5',
      '--radius-card': '0rem',
      '--radius-pill': '999px',
      '--font-heading': '"Helvetica Neue", Helvetica, Arial, sans-serif',
      '--font-body': '"Helvetica Neue", Helvetica, Arial, sans-serif',
    },
  },
};

export const DEFAULT_THEME_TOKEN = 'theme1';

export function getTheme(token) {
  return THEMES[token] ?? THEMES[DEFAULT_THEME_TOKEN];
}
