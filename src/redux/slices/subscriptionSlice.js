import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  loading: false,
  error: null,
};

/**
 * Creates a Stripe Checkout session for organization subscription.
 * Backend returns { url }; redirect to url to complete payment.
 */
export const createSubscriptionCheckoutSession = createAsyncThunk(
  "subscription/createSubscriptionCheckoutSession",
  async ({ organizationId, organizationType, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/payment/create-subscription-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ organizationId, organizationType }),
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to start subscription checkout"
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscriptionCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriptionCheckoutSession.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSubscriptionCheckoutSession.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to start subscription checkout";
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

export const selectSubscriptionLoading = (state) => state.subscription.loading;
export const selectSubscriptionError = (state) => state.subscription.error;
