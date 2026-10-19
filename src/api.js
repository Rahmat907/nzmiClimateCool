const TOKEN_KEY = 'coolcare_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, fieldErrors = null, status = 0) {
    super(message);
    this.fieldErrors = fieldErrors; // { phone: "...", pincode: "..." }
    this.status = status;
  }
}

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

const BASE_URL = import.meta.env.VITE_API_URL || '';
async function request(url, { auth = true, ...options } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  } catch {
    throw new ApiError('Cannot reach the server. Please check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth && token && onUnauthorized) onUnauthorized();
    throw new ApiError(data.error || 'Something went wrong. Please try again.', data.errors || null, res.status);
  }
  return data;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });
const qs = (params = {}) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return s ? `?${s}` : '';
};

export const api = {
  // auth
  register: (data) => request('/api/auth/register', { auth: false, ...json('POST', data) }),
  login: (phone, password) => request('/api/auth/login', { auth: false, ...json('POST', { phone, password }) }),
  me: () => request('/api/auth/me'),
  // customer
  createTicket: (data) => request('/api/tickets', json('POST', data)),
  myTickets: () => request('/api/tickets/mine'),
  getTicket: (id) => request(`/api/tickets/${id}`),
  cancelTicket: (id) => request(`/api/tickets/${id}/cancel`, { method: 'PATCH' }),
  // admin
  allTickets: (params) => request(`/api/tickets${qs(params)}`),
  stats: () => request('/api/tickets/stats/summary'),
  updateStatus: (id, status) => request(`/api/tickets/${id}/status`, json('PATCH', { status })),
};
