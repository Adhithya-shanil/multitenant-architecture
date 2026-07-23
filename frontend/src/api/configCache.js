import { fetchTheme, fetchCategoryConfig } from './config';

// There are only a handful of distinct themes/categories, reused across many
// stores. This caches the in-flight/resolved promise per token so visiting a
// second store that shares a theme or category never re-fetches it - the
// module-level Map persists for the life of the SPA session, no localStorage
// or HTTP caching required.
const themeCache = new Map();
const categoryCache = new Map();

export function getThemeConfig(token) {
  if (!themeCache.has(token)) {
    const promise = fetchTheme(token).catch((err) => {
      themeCache.delete(token);
      throw err;
    });
    themeCache.set(token, promise);
  }
  return themeCache.get(token);
}

export function getCategoryConfig(token) {
  if (!categoryCache.has(token)) {
    const promise = fetchCategoryConfig(token).catch((err) => {
      categoryCache.delete(token);
      throw err;
    });
    categoryCache.set(token, promise);
  }
  return categoryCache.get(token);
}
