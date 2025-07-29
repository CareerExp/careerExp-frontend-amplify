import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await FetchApi.fetch(`${config.api}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.success) {
      return rejectWithValue({
        message: response.message,
        field: response.field,
      });
    }

    return response;
  } catch (error) {
    return rejectWithValue({
      message: error.message || "Login failed",
      field: error.field || null,
    });
  }
});

const signup = createAsyncThunk("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    const response = await FetchApi.fetch(`${config.api}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
      message: error.message || "Registration failed",
      field: error.field || null,
    });
  }
});

const forgetPass = createAsyncThunk("auth/forgetPass", async (payload, { rejectWithValue }) => {
  try {
    const response = await FetchApi.fetch(`${config.api}/api/auth/forget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
      message: error.message || "Password reset request failed",
      field: error.field || null,
    });
  }
});

const forgetPassVerify = createAsyncThunk("auth/forgetPassVerify", async (payload) => {
  return FetchApi.fetch(
    `${config.api}/api/auth/verifypassword?userId=${payload.userId}&token=${payload.token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      },
    },
  );
});

// Define a slice of state for authentication
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    token: "",
    userId: "",
  },
  reducers: {
    logout(state) {
      state.user = "";
      state.isAuthenticated = false;
      state.token = "";
      state.userId = "";
      // Clear video data from localStorage
      localStorage.removeItem("viewedVideosWithTimestamp");
    },
    setIsAuthenticated(state, { payload }) {
      state.isAuthenticated = payload.isAuthenticated;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isAuthenticated = true;
        state.token = payload.token;
        state.userId = payload.userId;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {})
      .addCase(forgetPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPass.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgetPass.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(forgetPassVerify.fulfilled, (state, { payload }) => {
        //   alert(payload.message);
      });
  },
});

const selectAuthenticated = (state) => state.auth.isAuthenticated;
const selectAuthData = (state) => state.auth;
const selectToken = (state) => state.auth.token;
const selectUserId = (state) => state.auth.userId;
const { setIsAuthenticated, logout } = authSlice.actions;

export {
  selectAuthenticated,
  selectAuthData,
  selectToken,
  selectUserId,
  login,
  signup,
  forgetPass,
  forgetPassVerify,
  setIsAuthenticated,
  logout,
};
export default authSlice.reducer;
