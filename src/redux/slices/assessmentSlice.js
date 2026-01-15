// redux/slices/assessmentSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  reconcileStatus: "idle",
};

export const reconcileAssessmentAttempts = createAsyncThunk(
  "assessment/reconcileAssessmentAttempts",
  async ({ userId, token }) => {
    return FetchApi.fetch(`${config.api}/api/assessment/reconcile-attempts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
  }
);

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reconcileAssessmentAttempts.pending, (state) => {
        state.reconcileStatus = "loading";
      })
      .addCase(reconcileAssessmentAttempts.fulfilled, (state) => {
        state.reconcileStatus = "succeeded";
      })
      .addCase(reconcileAssessmentAttempts.rejected, (state) => {
        state.reconcileStatus = "failed";
      });
  },
});

export default assessmentSlice.reducer;
