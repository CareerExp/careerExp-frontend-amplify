import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  interestsProfile: [],
  educationLevel: [],
};

export const getInterests = createAsyncThunk(
  "interest/getInterests",
  async ({ userId, token, attemptNumber }, thunkAPI) => {
    try {
      let url = `${config.api}/api/interest/getinterestprofile/${userId}`;

      // Add attemptNumber to query params if provided
      if (attemptNumber) {
        url += `?attemptNumber=${attemptNumber}`;
      }

      return FetchApi.fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

const interestSlice = createSlice({
  name: "interest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInterests.fulfilled, (state, action) => {
      state.interestsProfile = action.payload;
      state.educationLevel = action.payload.educationLevel;
    });
  },
});

export const selectInterests = (state) => state.interest.interestsProfile;
export const selectEducationLevel = (state) => state.interest.educationLevel;

export default interestSlice.reducer;
