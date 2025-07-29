import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  allHistory: null,
  userLikedHistory: {},
};

export const getUserHistory = createAsyncThunk("userHistory/getUserHistory", async ({ userId, token }) => {
  return FetchApi.fetch(`${config.api}/api/history/getuserhistory/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
});

export const getUserAnalytics = createAsyncThunk(
  "userHistory/getUserAnalytics",
  async ({ userId, token }) => {
    const response = await fetch(`${config.api}/api/history/studentdashboardanalytics/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user analytics");
    }

    const data = await response.json(); // Parse the response data
    return data; // Return the data to be used by the reducer
  },
);

export const saveSharingDetails = createAsyncThunk(
  "userHistory/saveSharingDetails",
  async ({ userId, videoId }) => {
    return FetchApi.fetch(`${config.api}/api/history/saveSharingRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, videoId }),
    });
  },
);

export const getUserLikedHistory = createAsyncThunk(
  "userHistory/getUserLikedHistory",
  async ({ userId, token }) => {
    return FetchApi.fetch(`${config.api}/api/history/getLikedHistory/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const saveAndUpdateNotes = createAsyncThunk(
  "userHistory/saveAndUpdateNotes",
  async ({ userId, notes, videoId, token }) => {
    FetchApi.fetch(`${config.api}/api/history/saveNotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, notes, videoId }),
    });
    return { userId, notes, videoId };
  },
);

export const deleteNotesFromLikedVideos = createAsyncThunk(
  "userHistory/deleteNotesFromLikedVideos",
  async ({ userId, videoId, token }) => {
    FetchApi.fetch(`${config.api}/api/history/deleteNotes/${userId}/${videoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { userId, videoId };
  },
);

const userHistorySlice = createSlice({
  name: "userHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserHistory.fulfilled, (state, action) => {
      state.allHistory = action.payload;
    });
    builder.addCase(getUserAnalytics.fulfilled, (state, { payload }) => {
      // console.log("payload", payload);
      // state.allAnalytics = payload?.analytics;
    });
    builder.addCase(saveSharingDetails.fulfilled, (state, { payload }) => {
      // console.log("payload", payload);
    });
    builder.addCase(getUserLikedHistory.fulfilled, (state, action) => {
      state.userLikedHistory = action.payload;
    });
    builder.addCase(saveAndUpdateNotes.fulfilled, (state, { payload }) => {
      const { videoId, notes } = payload;

      if (state.userLikedHistory?.likedVideos) {
        const videoToUpdate = state.userLikedHistory.likedVideos.find((item) => item.videoId._id === videoId);

        if (videoToUpdate) {
          videoToUpdate.myNotes = notes;
        }
      }
    });

    builder.addCase(deleteNotesFromLikedVideos.fulfilled, (state, { payload }) => {
      const { videoId } = payload;

      if (state.userLikedHistory?.likedVideos) {
        const videoToUpdate = state.userLikedHistory.likedVideos.find((item) => item.videoId._id === videoId);

        if (videoToUpdate) {
          videoToUpdate.myNotes = "";
        }
      }
    });
  },
});

// Selectors
export const selectUserHistory = (state) => state.userHistory.allHistory;
export const selectLikedHistory = (state) => state.history.userLikedHistory || {};

export default userHistorySlice.reducer;
