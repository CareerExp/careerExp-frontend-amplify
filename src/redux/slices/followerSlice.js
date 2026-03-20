import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  followers: [],
  following: [],
  followerCount: 0,
  followingCount: 0,
  loading: false,
  actionLoading: false, // For specific actions like follow/unfollow/remove
  error: null,
};

export const fetchFollowers = createAsyncThunk(
  "follower/fetchFollowers",
  async ({ token, search }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);

      const url = `${config.api}/api/followers/me/list/followers${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

      const response = await FetchApi.fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  "follower/fetchFollowing",
  async ({ token, search }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);

      const url = `${config.api}/api/followers/me/list/following${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

      const response = await FetchApi.fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const toggleFollow = createAsyncThunk(
  "follower/toggleFollow",
  async ({ targetUserId, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/followers/follow/${targetUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return { targetUserId, ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const removeFollower = createAsyncThunk(
  "follower/removeFollower",
  async ({ followerId, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/followers/remove/${followerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return { followerId, ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const fetchFollowerCount = createAsyncThunk(
  "follower/fetchFollowerCount",
  async ({ userId, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/followers/count/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const fetchFollowingCount = createAsyncThunk(
  "follower/fetchFollowingCount",
  async ({ userId, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/followers/following-count/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const followerSlice = createSlice({
  name: "follower",
  initialState,
  reducers: {
    clearFollowerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Followers
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.followers = payload.data;
      })
      .addCase(fetchFollowers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to fetch followers";
      })
      
      // Fetch Following
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.following = payload.data;
      })
      .addCase(fetchFollowing.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to fetch following list";
      })

      // Toggle Follow (Follow/Unfollow)
      .addCase(toggleFollow.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(toggleFollow.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        // Logic to update following list if we are in the following tab
        // If the backend returns whether it followed or unfollowed, we can use that.
        // For now, we'll likely just refetch in the component, or we can filter it here if it's an unfollow.
      })
      .addCase(toggleFollow.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload?.error || "Action failed";
      })

      // Remove Follower
      .addCase(removeFollower.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(removeFollower.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.followers = state.followers.filter(
          (f) => f.followerId._id !== payload.followerId
        );
      })
      .addCase(removeFollower.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload?.error || "Failed to remove follower";
      })

      // Counts
      .addCase(fetchFollowerCount.fulfilled, (state, { payload }) => {
        state.followerCount = payload.count;
      })
      .addCase(fetchFollowingCount.fulfilled, (state, { payload }) => {
        state.followingCount = payload.count;
      });
  },
});

export const { clearFollowerError } = followerSlice.actions;

export const selectFollowers = (state) => state.follower.followers;
export const selectFollowing = (state) => state.follower.following;
export const selectFollowerCount = (state) => state.follower.followerCount;
export const selectFollowingCount = (state) => state.follower.followingCount;
export const selectFollowerLoading = (state) => state.follower.loading;
export const selectFollowerActionLoading = (state) => state.follower.actionLoading;
export const selectFollowerError = (state) => state.follower.error;

export default followerSlice.reducer;
