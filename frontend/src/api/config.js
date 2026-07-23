import { apiGet } from './client';

export function fetchTheme(token) {
  return apiGet(`/themes/${token}`).then((data) => data.theme);
}

export function fetchCategoryConfig(token) {
  return apiGet(`/categories/${token}`).then((data) => data.category);
}
