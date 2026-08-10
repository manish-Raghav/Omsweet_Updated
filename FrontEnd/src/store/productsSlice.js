import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api";


export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const { products } = await api.getProducts();
  return products;
});


export const fetchFilteredProducts = createAsyncThunk(
  "products/fetchFiltered",
  async (params = {}) => {
    const { products } = await api.getProducts(params);
    return products;
  }
);

// Backend-driven "top selling" showcase for a single category.
export const fetchTopSold = createAsyncThunk(
  "products/fetchTopSold",
  async ({ cat, limit = 4 }) => {
    const { products } = await api.getProducts({ cat, sort: "top-sold", limit });
    return { cat, products };
  }
);

export const addProduct = createAsyncThunk("products/add", async (payload) => {
  const { product } = await api.addProduct(payload);
  return product;
});

export const removeProduct = createAsyncThunk("products/remove", async (id) => {
  await api.removeProduct(id);
  return id;
});

const initialState = {
  products: [],
  status: "idle", 
  error: null,

  filtered: [],
  filteredStatus: "idle", 
  filteredError: null,

  topSold: {},
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.filteredStatus = "loading";
        state.filteredError = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.filteredStatus = "succeeded";
        state.filtered = action.payload;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.filteredStatus = "failed";
        state.filteredError = action.error.message;
      })
      .addCase(fetchTopSold.fulfilled, (state, action) => {
        state.topSold[action.payload.cat] = action.payload.products;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.filtered = state.filtered.filter((p) => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;

// ---- selectors ----
export const selectAllProducts = (state) => state.products.products;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsByCategory = (catKey) => (state) =>
  state.products.products.filter((p) => p.cat === catKey);

export const selectFilteredProducts = (state) => state.products.filtered;
export const selectFilteredStatus = (state) => state.products.filteredStatus;
export const selectFilteredError = (state) => state.products.filteredError;
export const selectTopSoldFor = (catKey) => (state) => state.products.topSold[catKey] || [];


function allKnownProductsById(state) {
  const map = new Map();
  state.products.products.forEach((p) => map.set(p.id, p));
  state.products.filtered.forEach((p) => map.set(p.id, p));
  Object.values(state.products.topSold).forEach((list) => list.forEach((p) => map.set(p.id, p)));
  return map;
}

export const selectAllKnownProducts = (state) => Array.from(allKnownProductsById(state).values());
export const selectProductById = (id) => (state) => allKnownProductsById(state).get(id);
