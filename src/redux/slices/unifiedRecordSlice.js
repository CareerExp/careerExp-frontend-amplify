import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  unifiedRecord: [],
  //admin
  allUnifiedData: [],
  userUnified: null,
};

export const getUnifiedRecordData = createAsyncThunk(
  "unifiedRecord/getUnifiedRecordData",
  async ({ userId, token }) => {
    return FetchApi.fetch(`${config.api}/api/unifiedrecord/getunifiedrecorddata/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const getAllUnifiedRecordData = createAsyncThunk(
  "unifiedRecord/getAllUnifiedRecordData",
  async ({ token, search = "", page = 1, limit = 10 }) => {
    const queryParams = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    return FetchApi.fetch(`${config.api}/api/unifiedrecord/getallunifiedrecorddata?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const getUnifiedRecordDataOfUser = createAsyncThunk(
  "unifiedRecord/getUnifiedRecordDataOfUser",
  async ({ unifiedId, token }) => {
    return FetchApi.fetch(`${config.api}/api/unifiedrecord/getunifiedrecorddataofuser/${unifiedId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const updatedResumeStatus = createAsyncThunk(
  "unifiedRecord/updatedResumeStatus",
  async ({ userId, token }) => {
    return FetchApi.fetch(`${config.api}/api/unifiedrecord/updateunifiedrecordstatus/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const uploadCdrToStorage = createAsyncThunk(
  "unifiedRecord/uploadCdrToStorage",
  async ({ userId, token, formData, attemptNumber }, thunkAPI) => {
    try {
      const response = await fetch(
        `${config.api}/api/unifiedrecord/savecdrtostorage/${userId}/${attemptNumber}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload cdr to storage");
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

const unifiedRecordSlice = createSlice({
  name: "unifiedRecord",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnifiedRecordData.fulfilled, (state, action) => {
      state.unifiedRecord = action.payload.unifiedRecordData;
    });

    builder.addCase(getAllUnifiedRecordData.fulfilled, (state, action) => {
      state.allUnifiedData = action.payload;
    });

    builder.addCase(getUnifiedRecordDataOfUser.fulfilled, (state, action) => {
      state.userUnified = action.payload;
    });

    builder.addCase(updatedResumeStatus.fulfilled, (state, action) => {
      // state.userUnified = action.payload;
    });
  },
});

export const selectUnifiedRecord = (state) => state.unifiedRecord.unifiedRecord;
export const selectAllUnifiedData = (state) => state.unifiedRecord.allUnifiedData;

export const selectUserUnified = (state) => state.unifiedRecord.userUnified;
export default unifiedRecordSlice.reducer;
