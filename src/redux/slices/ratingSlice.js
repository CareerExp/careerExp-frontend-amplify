import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  rating: null,
  serviceRating: null,
  courseRating: null,
};

export const getRatingStatus = createAsyncThunk(
  "rating/getRatingStatus",
  async ({ videoId, userId, token }) => {
    return FetchApi.fetch(`${config.api}/api/rating/getratingstatus/${videoId}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const rateVideo = createAsyncThunk("rating/rateVideo", async ({ videoId, userId, token, rating }) => {
  return FetchApi.fetch(`${config.api}/api/rating/ratevideo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ videoId, userId, rating }),
  });
});

/** Get current user's star rating for a service. GET /api/rating/getserviceratingstatus/:serviceId/:userId. Auth required. */
export const getServiceRatingStatus = createAsyncThunk(
  "rating/getServiceRatingStatus",
  async ({ serviceId, userId, token }) => {
    return FetchApi.fetch(
      `${config.api}/api/rating/getserviceratingstatus/${serviceId}/${userId}`,
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

/** Rate a service (1–5 stars). POST /api/rating/rateservice. Auth required. */
export const rateService = createAsyncThunk(
  "rating/rateService",
  async ({ serviceId, userId, rating, token }) => {
    return FetchApi.fetch(`${config.api}/api/rating/rateservice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ serviceId, userId, rating }),
    });
  }
);

/** GET /api/rating/getcourseratingstatus/:courseId/:userId. Returns { message, rating } (0 if not rated). Auth required. */
export const getCourseRatingStatus = createAsyncThunk(
  "rating/getCourseRatingStatus",
  async ({ courseId, userId, token }) => {
    return FetchApi.fetch(
      `${config.api}/api/rating/getcourseratingstatus/${courseId}/${userId}`,
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

/** POST /api/rating/ratecourse. Body: { courseId, userId, rating } (1–5). Returns { message, averageRating, totalRatings, rating }. Auth required. */
export const rateCourse = createAsyncThunk(
  "rating/rateCourse",
  async ({ courseId, userId, rating, token }) => {
    return FetchApi.fetch(`${config.api}/api/rating/ratecourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId, userId, rating }),
    });
  }
);

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRatingStatus.fulfilled, (state, action) => {
      state.rating = action.payload;
    });
    builder.addCase(rateVideo.fulfilled, (state, action) => {
      state.rating = action.payload;
    });
    builder.addCase(getServiceRatingStatus.fulfilled, (state, action) => {
      state.serviceRating = action.payload;
    });
    builder.addCase(rateService.fulfilled, (state, action) => {
      state.serviceRating = action.payload;
    });
    builder.addCase(getCourseRatingStatus.fulfilled, (state, action) => {
      state.courseRating = action.payload;
    });
    builder.addCase(rateCourse.fulfilled, (state, action) => {
      state.courseRating = action.payload;
    });
  },
});

export default ratingSlice.reducer;
export const selectRating = (state) => state.rating.rating;
export const selectServiceRating = (state) => state.rating.serviceRating;
export const selectCourseRating = (state) => state.rating.courseRating;
