const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "omsweet_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error("Couldn't reach the server. Is the backend running?");
    err.status = 0;
    throw err;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {

  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/auth/me", { auth: true }),
  allUsers: () => request("/auth/users", { auth: true }),


  getProducts: (params) => {
    const clean = params
      ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""))
      : {};
    const qs = Object.keys(clean).length ? `?${new URLSearchParams(clean).toString()}` : "";
    return request(`/products${qs}`);
  },
  addProduct: (payload) => request("/products", { method: "POST", body: payload, auth: true }),
  removeProduct: (id) => request(`/products/${id}`, { method: "DELETE", auth: true }),


  placeOrder: (payload) => request("/orders", { method: "POST", body: payload, auth: true }),
  myOrders: () => request("/orders/mine", { auth: true }),
  allOrders: () => request("/orders", { auth: true }),

  
  getCart: () => request("/cart", { auth: true }),
  addCartItem: (id, qty) => request("/cart/items", { method: "POST", body: { id, qty }, auth: true }),
  incCartItem: (id) => request(`/cart/items/${id}/inc`, { method: "PATCH", auth: true }),
  decCartItem: (id) => request(`/cart/items/${id}/dec`, { method: "PATCH", auth: true }),
  removeCartItem: (id) => request(`/cart/items/${id}`, { method: "DELETE", auth: true }),
  clearCart: () => request("/cart", { method: "DELETE", auth: true }),
  mergeCart: (items) => request("/cart/merge", { method: "POST", body: { items }, auth: true }),
};
