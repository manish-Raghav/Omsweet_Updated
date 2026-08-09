// Tiny wrapper around localStorage for the bits of state that stay purely
// client-side now that the backend owns users/products/orders: the shopping
// cart, and a cached copy of the logged-in user for instant UI on reload.

const KEYS = {
  CURRENT_USER: "omsweet_current_user",
  CART: "omsweet_cart",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  KEYS,
  read,
  write,
};
