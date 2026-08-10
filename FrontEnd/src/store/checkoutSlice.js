import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addressSaved(state, action) {
      state.address = action.payload;
    },
    addressCleared(state) {
      state.address = null;
    },
  },
});

export const { addressSaved, addressCleared } = checkoutSlice.actions;
export default checkoutSlice.reducer;


export const selectCheckoutAddress = (state) => state.checkout.address;
