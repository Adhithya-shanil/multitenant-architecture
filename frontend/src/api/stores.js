import { apiGet } from './client';

export function fetchStores() {
  return apiGet('/stores').then((data) => data.stores);
}

export function fetchStoreByHandle(handle) {
  return apiGet(`/stores/${handle}`).then((data) => data.store);
}

export function fetchStoreProducts(handle) {
  return apiGet(`/stores/${handle}/products`).then((data) => data.products);
}
