

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
