import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  payment: null,
  isPaid: false,
  remainingAttempts: 0,
};

export const initiatePayment = createAsyncThunk(
  "payment/initiatePayment",
  async ({ userId, token, couponCode }) => {
    console.log(userId, token);
    return FetchApi.fetch(`${config.api}/api/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, couponCode }),
    });
  },
);

export const verifyPayment = createAsyncThunk("payment/verifyPayment", async ({ userId, token }) => {
  return FetchApi.fetch(`${config.api}/api/payment/verify-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });
});

export const getPaymentStatus = createAsyncThunk("payment/getPaymentStatus", async ({ userId, token }) => {
  return FetchApi.fetch(`${config.api}/api/payment/get-payment-status/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
});

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initiatePayment.fulfilled, (state, action) => {
      // console.log("payload", action.payload);
      // state.payment = action.payload;
    });

    builder.addCase(verifyPayment.fulfilled, (state, action) => {
      // console.log("payload", action.payload);
      // state.payment = action.payload;
    });

    builder.addCase(getPaymentStatus.fulfilled, (state, action) => {
      // state.payment = action.payload;
      state.isPaid = action.payload.isPaid;
      state.remainingAttempts = action.payload.remainingAttempts;
    });
  },
});

export default paymentSlice.reducer;

export const selectIsPaid = (state) => state.payment.isPaid;
export const selectRemainingAttempts = (state) => state.payment.remainingAttempts;

export const selectPayment = (state) => state.payment.payment;
