import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  userProfile: null,
};

// Async thunk for fetching user profile
export const getUserProfile = createAsyncThunk(
  "profile/getUserProfile",
  async ({ userId, token }, thunkAPI) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/profile/userProfile/${userId}`, {
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

// export const updatePassword = createAsyncThunk(
//   "profile/updatePassword",
//   async ({ userId, formData, token }, thunkAPI) => {
//     try {
//       return await FetchApi.fetch(`${config.api}/api/profile/updatePassword/${userId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   },
// );

export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async ({ userId, formData, token }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/profile/updatePassword/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.success) {
        return rejectWithValue({
          message: response.message,
          field: response.field || null,
        });
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to update password",
        field: error.field || null,
      });
    }
  },
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ userId, updatedData, token }, thunkAPI) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/profile/updateProfile/${userId}`, {
        method: "PATCH", // Assuming this is a PUT request for updating
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const uploadProfilePicture = createAsyncThunk(
  "profile/uploadProfilePicture",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      const response = await fetch(`${config.api}/api/profile/uploadProfilePicture/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const updatePaymentStatus = createAsyncThunk(
  "user/updatePaymentStatus",
  async ({ userId, token }, thunkAPI) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/stripe/updatePaymentStatus/${userId}`, {
        method: "POST",
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.fulfilled, (state, { payload }) => {
      state.userProfile = payload;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
      state.userProfile = payload.user;
    });
    builder.addCase(uploadProfilePicture.fulfilled, (state, { payload }) => {
      state.userProfile.profilePicture = payload.profilePicture;
    });
    builder.addCase(updatePaymentStatus.fulfilled, (state, { payload }) => {
      // state.userProfile.paymentStatus = payload.paymentStatus;
    });
    builder.addCase(updatePassword.fulfilled, (state, { payload }) => {
      // Handle password update success if needed
      // console.log("Password updated successfully", payload);
    });
  },
});

export const selectUserProfile = (state) => state.profile.userProfile;

export default profileSlice.reducer;
