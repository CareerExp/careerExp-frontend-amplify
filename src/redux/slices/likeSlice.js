import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  userLiked: null,
  totalShares: null,
  totalViews: null,
  courseUserLiked: null,
  courseTotalLikes: null,
};

export const getLikeStatus = createAsyncThunk("like/getLikeStatus", async ({ videoId, userId, token }) => {
  return FetchApi.fetch(`${config.api}/api/like/getlikestatus/${videoId}/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
});

export const toggleLike = createAsyncThunk("like/toggleLike", async ({ videoId, userId, token }) => {
  return FetchApi.fetch(`${config.api}/api/like/togglelikevideo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ videoId, userId }),
  });
});

export const increaseViewsCount = createAsyncThunk("like/increaseViewsCount", async ({ videoId, userId }) => {
  return FetchApi.fetch(`${config.api}/api/viewsAndShares/increaseviewscount/${videoId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
});

export const increaseSharesCount = createAsyncThunk(
  "like/increaseSharesCount",
  async ({ videoId, userId }) => {
    return FetchApi.fetch(`${config.api}/api/viewsAndShares/increasesharescount/${videoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
  },
);

/** GET /api/like/getcourselikestatus/:courseId/:userId. Auth required. */
export const getCourseLikeStatus = createAsyncThunk(
  "like/getCourseLikeStatus",
  async ({ courseId, userId, token }) => {
    return FetchApi.fetch(
      `${config.api}/api/like/getcourselikestatus/${courseId}/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
);

/** POST /api/like/togglelikecourse. Body: { courseId, userId }. Returns { message, userLiked, totalLikes }. */
export const toggleCourseLike = createAsyncThunk(
  "like/toggleCourseLike",
  async ({ courseId, userId, token }) => {
    return FetchApi.fetch(`${config.api}/api/like/togglelikecourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId, userId }),
    });
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLikeStatus.fulfilled, (state, { payload }) => {
      state.userLiked = payload.userLiked;
    });
    builder.addCase(toggleLike.fulfilled, (state, { payload }) => {
      state.userLiked = payload.userLiked;
      state.totalLikes = payload.totalLikes;
    });
    builder.addCase(increaseViewsCount.fulfilled, (state, { payload }) => {
      state.totalViews = payload.updatedValue;
    });
    builder.addCase(increaseSharesCount.fulfilled, (state, { payload }) => {
      state.totalShares = payload.updatedValue;
    });
    builder.addCase(getCourseLikeStatus.fulfilled, (state, { payload }) => {
      state.courseUserLiked = payload?.userLiked ?? null;
    });
    builder.addCase(toggleCourseLike.fulfilled, (state, { payload }) => {
      state.courseUserLiked = payload?.userLiked ?? null;
      if (payload?.totalLikes != null) state.courseTotalLikes = payload.totalLikes;
    });
  },
});

export default likeSlice.reducer;
export const selectUserLiked = (state) => state.like.userLiked;
export const selectCourseUserLiked = (state) => state.like.courseUserLiked;
export const selectCourseTotalLikes = (state) => state.like.courseTotalLikes;
