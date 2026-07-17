const API_BASE = '/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed with status ${res.status}`, res.status);
  }

  return data;
}
