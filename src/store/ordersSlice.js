import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api";

export const placeOrder = createAsyncThunk("orders/place", async (payload) => {
  const { order } = await api.placeOrder(payload);
  return order;
});

export const fetchMyOrders = createAsyncThunk("orders/fetchMine", async () => {
  const { orders } = await api.myOrders();
  return orders;
});

export const fetchAllOrders = createAsyncThunk("orders/fetchAll", async () => {
  const { orders } = await api.allOrders();
  return orders;
});

const initialState = {
  mine: [],
  all: [],
  status: "idle",
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mine.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.mine = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.all = action.payload;
      });
  },
});

export default ordersSlice.reducer;


export const selectMyOrders = (state) => state.orders.mine;
export const selectAllOrdersAdmin = (state) => state.orders.all;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;
