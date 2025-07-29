import { useScrollTrigger } from "@mui/material";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  resumeData: [],
};

export const getResume = createAsyncThunk("resume/getResume", async ({ userId, token }, thunkAPI) => {
  try {
    return await FetchApi.fetch(`${config.api}/api/resume/getResume/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const updateResume = createAsyncThunk(
  "resume/updateResume",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/resume/updateResume/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const uploadResume = createAsyncThunk(
  "resume/uploadResume",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      const response = await fetch(`${config.api}/api/resume/uploadResume/${userId}`, {
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

export const updateComment = createAsyncThunk(
  "resume/updateComment",
  async ({ commentId, comment, token, userId }, thunkAPI) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/resume/updateComment/${commentId}/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const updatePurpose = createAsyncThunk(
  "resume/updatePurpose",
  async ({ resumeId, purpose, token, userId }, thunkAPI) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/resume/updatePurpose/${resumeId}/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ purpose }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const deleteResume = createAsyncThunk(
  "resume/deleteResume",
  async ({ resumeId, userId, token }, thunkAPI) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/resume/deleteResume/${resumeId}/${userId}`, {
        method: "DELETE",
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

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getResume.fulfilled, (state, action) => {
      state.resumeData = action.payload;
    });

    builder.addCase(updateResume.fulfilled, (state, action) => {
      state.resumeData = action.payload;
    });

    builder.addCase(uploadResume.fulfilled, (state, action) => {
      // state.resumeData = action.payload;
    });

    builder.addCase(updateComment.fulfilled, (state, action) => {
      // state.resumeData = action.payload;
    });

    builder.addCase(updatePurpose.fulfilled, (state, action) => {
      // state.resumeData = action.payload;
    });

    builder.addCase(deleteResume.fulfilled, (state, action) => {
      state.resumeData = action.payload.data;
    });
  },
});

export const selectResume = (state) => state.resume.resumeData;

export default resumeSlice.reducer;
