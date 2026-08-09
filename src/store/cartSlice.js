import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storage } from "../utils/storage";
import { api, getToken } from "../services/api";

// cart shape (unchanged from the old localStorage version, so nothing that
// reads `selectCart` had to change): { [productId]: qty }

function readGuestCart() {
  return storage.read(storage.KEYS.CART, {});
}
function persistGuestCart(cart) {
  storage.write(storage.KEYS.CART, cart);
}

const initialState = {
  cart: readGuestCart(),
  status: "idle", // idle | loading | failed
};

// Logged-in users get a real cart in MongoDB (one document per user, see
// backend/src/models/Cart.model.js); signed-out visitors keep a cart in
// localStorage so browsing/adding items doesn't require an account. Every
// mutation below picks the right backend and returns the resulting cart map
// so the reducer only ever has to do `state.cart = action.payload`.

async function guestMutate(getState, mutate) {
  const cart = { ...getState().cart.cart };
  mutate(cart);
  persistGuestCart(cart);
  return cart;
}

export const itemAdded = createAsyncThunk(
  "cart/itemAdded",
  async ({ id, qty = 1 }, { getState }) => {
    if (getToken()) {
      const { cart } = await api.addCartItem(id, qty);
      return cart;
    }
    return guestMutate(getState, (cart) => {
      cart[id] = (cart[id] || 0) + qty;
    });
  }
);

export const itemIncremented = createAsyncThunk(
  "cart/itemIncremented",
  async (id, { getState }) => {
    if (getToken()) {
      const { cart } = await api.incCartItem(id);
      return cart;
    }
    return guestMutate(getState, (cart) => {
      cart[id] = (cart[id] || 0) + 1;
    });
  }
);

export const itemDecremented = createAsyncThunk(
  "cart/itemDecremented",
  async (id, { getState }) => {
    if (getToken()) {
      const { cart } = await api.decCartItem(id);
      return cart;
    }
    return guestMutate(getState, (cart) => {
      const next = Math.max((cart[id] || 0) - 1, 0);
      if (next === 0) delete cart[id];
      else cart[id] = next;
    });
  }
);

export const itemRemoved = createAsyncThunk(
  "cart/itemRemoved",
  async (id, { getState }) => {
    if (getToken()) {
      const { cart } = await api.removeCartItem(id);
      return cart;
    }
    return guestMutate(getState, (cart) => {
      delete cart[id];
    });
  }
);

export const cartCleared = createAsyncThunk("cart/cartCleared", async () => {
  if (getToken()) {
    const { cart } = await api.clearCart();
    return cart;
  }
  persistGuestCart({});
  return {};
});

// Run once right after login/signup succeeds (and again on app boot, when a
// cached session is revalidated): folds anything sitting in the guest
// (localStorage) cart into the account's cart on the server, then makes the
// server copy the source of truth. If there's nothing to merge it just
// fetches the account's existing cart.
export const syncCartWithServer = createAsyncThunk(
  "cart/syncCartWithServer",
  async () => {
    const guestCart = readGuestCart();
    const hasGuestItems = Object.keys(guestCart).length > 0;
    const { cart } = hasGuestItems ? await api.mergeCart(guestCart) : await api.getCart();
    if (hasGuestItems) persistGuestCart({}); // now folded into the account, drop the local copy
    return cart;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Called on logout: the account's cart no longer applies, so fall back
    // to whatever's sitting in the guest cart (usually empty).
    cartReset(state) {
      state.cart = readGuestCart();
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.cart = action.payload;
      state.status = "idle";
    };
    const setFailed = (state) => {
      state.status = "failed";
    };

    builder
      .addCase(itemAdded.fulfilled, setCart)
      .addCase(itemIncremented.fulfilled, setCart)
      .addCase(itemDecremented.fulfilled, setCart)
      .addCase(itemRemoved.fulfilled, setCart)
      .addCase(cartCleared.fulfilled, setCart)
      .addCase(syncCartWithServer.fulfilled, setCart)
      .addCase(itemAdded.rejected, setFailed)
      .addCase(itemIncremented.rejected, setFailed)
      .addCase(itemDecremented.rejected, setFailed)
      .addCase(itemRemoved.rejected, setFailed)
      .addCase(cartCleared.rejected, setFailed)
      .addCase(syncCartWithServer.rejected, setFailed);
  },
});

export const { cartReset } = cartSlice.actions;
export default cartSlice.reducer;

// ---- selectors ----
export const selectCart = (state) => state.cart.cart;
export const selectCartCount = (state) =>
  Object.values(state.cart.cart).reduce((sum, qty) => sum + qty, 0);
