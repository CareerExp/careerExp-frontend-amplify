import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  allVideos: [],
  mostViewedThumbnails: [],
  allTags: [],
};

export const getAllVideos = createAsyncThunk(
  "explore/getAllVideos",
  async ({
    page = 1,
    limit = 12,
    category = "",
    language = "",
    tags = [],
    search = "",
  }) => {
    try {
      const query = new URLSearchParams({
        page,
        limit,
        category,
        language,
        tags: tags.join(","), // Convert tags array to comma-separated string
        search,
      }).toString();

      return await FetchApi.fetch(
        `${config.api}/api/explore/getallvideos?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // if (!response.ok) throw new Error("Failed to fetch videos.");

      // return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const getAllTags = createAsyncThunk("explore/getAllTags", async () => {
  try {
    return await FetchApi.fetch(`${config.api}/api/explore/getalltags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const getTrendingVideos = createAsyncThunk(
  "explore/getTrendingVideos",
  async ({
    page = 1,
    limit = 12,
    sortBy = "views", // Default sort by views
  }) => {
    try {
      // const query = new URLSearchParams({
      //   page,
      //   limit,
      //   sortBy,
      // }).toString();

      return await FetchApi.fetch(
        `${config.api}/api/explore/gettrendingvideos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const getVideosByUserInterests = createAsyncThunk(
  "explore/getVideosByUserInterests",
  async ({ userId, page = 1, limit = 12 }) => {
    try {
      const query = new URLSearchParams({
        userId,
        page,
        limit,
      }).toString();

      return await FetchApi.fetch(
        `${config.api}/api/explore/getvideosbyuserinterests?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const getRelatedSearchVideos = createAsyncThunk(
  "explore/getRelatedSearchVideos",
  async ({ category = "", tags = [], page = 1, limit = 12 }) => {
    try {
      const query = new URLSearchParams({
        page,
        limit,
        category,
        tags: tags.join(","),
      }).toString();

      return await FetchApi.fetch(
        `${config.api}/api/explore/getrelatedsearchvideos?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const getMostViewedThumbnails = createAsyncThunk(
  "explore/getMostViewedThumbnails",
  async () => {
    try {
      return await FetchApi.fetch(
        `${config.api}/api/explore/getmostviewedthumbnails`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const videoFilter = createAsyncThunk(
  "creator/videoFilter",
  async ({ category, language, tags, search }) => {
    // console.log("category", category, "language", language, "tags", tags, "search", search);
    try {
      return await FetchApi.fetch(`${config.api}/api/creator/video/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, language, tags, search }),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    resetRelatedSearchVideos: (state) => {
      state.relatedSearchVideos = {
        videos: [],
        totalPages: 1,
        currentPage: 1,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllVideos.fulfilled, (state, { payload }) => {
      state.allVideos = payload;
    });
    builder.addCase(getAllTags.fulfilled, (state, { payload }) => {
      state.allTags = payload.tags;
    });
    builder.addCase(getTrendingVideos.fulfilled, (state, { payload }) => {
      state.trendingVideos = payload;
    });
    builder.addCase(
      getVideosByUserInterests.fulfilled,
      (state, { payload }) => {
        state.userInterestsVideos = payload;
      }
    );
    builder.addCase(getRelatedSearchVideos.fulfilled, (state, { payload }) => {
      state.relatedSearchVideos = payload;
    });
    builder.addCase(getMostViewedThumbnails.fulfilled, (state, { payload }) => {
      state.mostViewedThumbnails = payload.thumbnails;
    });
    builder.addCase(videoFilter.fulfilled, (state, { payload }) => {
      state.allVideos = payload.data;
    });
  },
});

export const selectAllVideos = (state) => state.explore.allVideos;
export const selectAllTags = (state) => state.explore.allTags;
export const selectTrendingVideos = (state) => state.explore.trendingVideos;
export const selectUserInterestsVideos = (state) =>
  state.explore.userInterestsVideos;
export const selectRelatedSearchVideos = (state) =>
  state.explore.relatedSearchVideos;
export const selectMostViewedThumbnails = (state) =>
  state.explore.mostViewedThumbnails;
export const { resetRelatedSearchVideos } = exploreSlice.actions;
export default exploreSlice.reducer;
