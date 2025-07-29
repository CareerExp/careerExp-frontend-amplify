import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  uploadingVideoData: null,
  uploadingThumbnailData: null,
  authorVideos: [],
  getGeneralStates: null,
  allVideos: [],
  creatorProfile: null,
  isFollowing: false, // changed from { isFollowing: false } to false
  followerCount: 0,
  CounsellorAnalytics: null,
};

export const uploadVideo = createAsyncThunk(
  "creator/uploadVideo",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      const response = await fetch(`${config.api}/api/creator/uploadVideo/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const uploadThumbnail = createAsyncThunk(
  "creator/uploadThumbnail",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      const response = await fetch(`${config.api}/api/creator/uploadThumbnail/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const updateVideo = createAsyncThunk(
  "creator/updateVideo",
  async ({ userId, videoId, formData, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/updateVideo/${userId}/${videoId}`, {
        method: "POST",
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

export const getYoutubeVideoTags = createAsyncThunk(
  "creator/getYoutubeVideoTags",
  async ({ youtubeUrl, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/transcription/youtube-transcribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ youtubeUrl }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const uploadYoutubeVideo = createAsyncThunk(
  "creator/uploadYoutubeVideo",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/uploadyoutube/${userId}`, {
        method: "POST",
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

export const getAuthorVideos = createAsyncThunk(
  "creator/getAuthorVideos",
  async ({ userId, page = 1, limit = 10, search = "" }, thunkAPI) => {
    const queryParams = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });
    try {
      return FetchApi.fetch(`${config.api}/api/creator/getauthorvideos/${userId}?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const deleteVideo = createAsyncThunk(
  "creator/deleteVideo",
  async ({ userId, videoId, token }, thunkAPI) => {
    try {
      FetchApi.fetch(`${config.api}/api/creator/deleteVideo/${userId}/${videoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return { videoId };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const searchVideosByTitle = createAsyncThunk(
  "creator/searchVideosByTitle",
  async ({ userId, title }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/creator/videosearch/${userId}?title=${title}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

export const socialMediaLink = createAsyncThunk(
  "creator/socialMediaLink",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/creatorsocialmedia/${userId}`, {
        method: "POST",
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

export const getGeneralVideoData = createAsyncThunk(
  "creator/getGeneralVideoData",
  async ({ userId, token }) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/creator/getGeneralVideoData/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

export const allvideos = createAsyncThunk("creator/allvideos", async ({ page }) => {
  try {
    return await FetchApi.fetch(`${config.api}/api/creator/allvideos?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const videoDetailById = createAsyncThunk("creator/videoDetailById", async ({ videoId }) => {
  try {
    return await FetchApi.fetch(`${config.api}/api/creator/video/${videoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const getCreatorProfile = createAsyncThunk("creator/getCreatorProfile", async ({ userId }) => {
  try {
    return await FetchApi.fetch(`${config.api}/api/creator/getCreatorProfile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

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
  },
);

export const getLikeStatus = createAsyncThunk("creator/getLikeStatus", async ({ videoId, userId }) => {
  try {
    return await FetchApi.fetch(`${config.api}/api/creator/getLikeStatus/${videoId}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const toggleLike = createAsyncThunk("creator/toggleLike", async ({ videoId, userId, token }) => {
  try {
    return await FetchApi.fetch(`${config.api}/api/creator/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ video: videoId, user: userId }),
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const addRating = createAsyncThunk("creator/addRating", async ({ videoId, userId, rating, token }) => {
  try {
    return await FetchApi.fetch(`${config.api}/api/creator/postrating/${videoId}/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating }),
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const getUserRatingOfVideo = createAsyncThunk(
  "creator/getUserRatingOfVideo",
  async ({ videoId, userId }) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/creator/getrating/${videoId}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

//handle follow
export const creatorFollowToggle = createAsyncThunk(
  "creator/creatorFollowToggle",
  async ({ userId, targetUserId, token }) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/followers/follow/${targetUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

//cehck follow
export const checkFollowStatus = createAsyncThunk(
  "creator/checkFollowStatus",
  async ({ targetUserId, token, userId }) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/followers/check-follow/${targetUserId}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

export const getCounsellorAnalytics = createAsyncThunk(
  "creator/getCounsellorAnalytics",
  async ({ userId, token }) => {
    try {
      return await FetchApi.fetch(`${config.api}/api/creator/counsellorAnalytics/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

const creatorSlice = createSlice({
  name: "creator",
  initialState,
  reducers: {
    resetState: (state) => {
      state.allVideos = [];
    },
    resetVideoData: (state) => {
      state.uploadingVideoData = null;
      state.uploadingThumbnailData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadVideo.fulfilled, (state, { payload }) => {
      state.uploadingVideoData = payload.data;
    });
    builder.addCase(uploadThumbnail.fulfilled, (state, { payload }) => {
      state.uploadingThumbnailData = payload.link;
    });
    builder.addCase(updateVideo.fulfilled, (state, { payload }) => {
      if (state.authorVideos && state.authorVideos.videos) {
        state.authorVideos.videos = state.authorVideos.videos.map((video) => {
          if (video._id === payload.video._id) {
            return payload.video;
          }
          return video;
        });
      }
    });

    builder.addCase(uploadYoutubeVideo.fulfilled, (state, { payload }) => {
      // console.log("uploadYoutubeVideo", payload);
    });
    builder.addCase(getAuthorVideos.fulfilled, (state, { payload }) => {
      // console.log("authorpayload", payload);
      state.authorVideos = payload;
    });
    builder.addCase(deleteVideo.fulfilled, (state, { payload }) => {
      state.authorVideos.videos = state.authorVideos.videos.filter((video) => video._id !== payload.videoId);
    });
    builder.addCase(searchVideosByTitle.fulfilled, (state, { payload }) => {
      state.authorVideos = payload;
    });
    builder.addCase(socialMediaLink.fulfilled, (state, { payload }) => {});
    builder.addCase(getGeneralVideoData.fulfilled, (state, { payload }) => {
      if (payload.data) {
        state.getGeneralStates = payload.data;
      }
    });
    builder.addCase(allvideos.fulfilled, (state, { payload }) => {
      state.allVideos = payload.data;
    });
    builder.addCase(videoDetailById.fulfilled, (state, { payload }) => {
      // console.log("videoDetailById", payload);
    });
    builder.addCase(getCreatorProfile.fulfilled, (state, { payload }) => {
      state.creatorProfile = payload;
      state.followerCount = payload.followerCount;
    });
    builder.addCase(videoFilter.fulfilled, (state, { payload }) => {
      state.allVideos = payload.data;
    });

    builder.addCase(toggleLike.fulfilled, (state, { payload }) => {});
    builder.addCase(addRating.fulfilled, (state, { payload }) => {});
    builder.addCase(getUserRatingOfVideo.fulfilled, (state, { payload }) => {});
    // toggle creator follow
    builder.addCase(creatorFollowToggle.fulfilled, (state, { payload }) => {
      if (payload.message === "User unfollowed successfully.") {
        state.isFollowing = false;
        state.followerCount -= 1;
      } else {
        state.isFollowing = true;
        state.followerCount += 1;
      }
    });
    //check if folllowing
    builder.addCase(checkFollowStatus.fulfilled, (state, { payload }) => {
      console.log("payload", payload);
      // Always set as boolean
      state.isFollowing = payload;
    });

    builder.addCase(getCounsellorAnalytics.fulfilled, (state, { payload }) => {
      // console.log("payload", payload);
      state.CounsellorAnalytics = payload;
    });
  },
});

export const { resetState, resetVideoData } = creatorSlice.actions;

export const selectVideoLink = (state) => state.creator.uploadingVideoData;
export const selectThumbnailLink = (state) => state.creator.uploadingThumbnailData;
export const selectAuthorVideos = (state) => state.creator.authorVideos;
export const selectGeneralVideoData = (state) => state.creator.getGeneralStates;
export const selectAllVideosData = (state) => state.creator.allVideos;
export const selectCreatorProfile = (state) => state.creator.creatorProfile;
export const selectIsFollowing = (state) => state.creator.isFollowing;
export const selectFollowerCount = (state) => state.creator.followerCount;
export const selectCounsellorAnalytics = (state) => state.creator.CounsellorAnalytics;

export default creatorSlice.reducer;
