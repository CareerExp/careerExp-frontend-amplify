import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  AllPlaylistName: [],
  playListData: [],
  loading: false,
  error: null,
};

export const getUserPlaylist = createAsyncThunk("playlist/getUserPlaylist", async ({ userId, token }) => {
  return FetchApi.fetch(`${config.api}/api/playlist/getuserplaylist/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
});

export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async ({ playlistName, userId, token }) => {
    return FetchApi.fetch(`${config.api}/api/playlist/createplaylist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistName, userId }),
    });
  },
);

export const deletePlaylist = createAsyncThunk("playlist/deletePlaylist", async ({ playlistId, token }) => {
  return FetchApi.fetch(`${config.api}/api/playlist/deleteplaylist/${playlistId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
});

export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideoToPlaylist",
  async ({ playlistId, videoId, token }) => {
    return FetchApi.fetch(`${config.api}/api/playlist/addvideotoplaylist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistId, videoId }),
    });
  },
);

export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideoFromPlaylist",
  async ({ playlistId, videoId, token }) => {
    return FetchApi.fetch(`${config.api}/api/playlist/removevideofromplaylist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistId, videoId }),
    });
  },
);

export const moveVideoToDifferentPlaylist = createAsyncThunk(
  "playlist/moveVideoToDifferentPlaylist",
  async ({ sourcePlaylistId, targetPlaylistId, videoId, token }) => {
    return FetchApi.fetch(`${config.api}/api/playlist/movevideo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sourcePlaylistId, targetPlaylistId, videoId }),
    });
  },
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get user playlists
    builder.addCase(getUserPlaylist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserPlaylist.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.AllPlaylistName = payload.playlistNamesAll;
      state.playListData = payload.playlistsData;
    });
    builder.addCase(getUserPlaylist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Create playlist
    builder.addCase(createPlaylist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPlaylist.fulfilled, (state, { payload }) => {
      state.loading = false;
      // Add the new playlist to AllPlaylistName array
      if (payload.playlist) {
        state.AllPlaylistName.push({
          playlistName: payload.playlist.playlistName,
          playlistId: payload.playlist._id,
        });
        // Add empty playlist to playListData
        state.playListData.push({
          ...payload.playlist,
          videoId: [],
        });
      }
    });
    builder.addCase(createPlaylist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Delete playlist
    builder.addCase(deletePlaylist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePlaylist.fulfilled, (state, { payload, meta }) => {
      state.loading = false;
      const playlistId = meta.arg.playlistId;
      // Remove the playlist from AllPlaylistName
      state.AllPlaylistName = state.AllPlaylistName.filter((playlist) => playlist.playlistId !== playlistId);
      // Remove the playlist from playListData
      state.playListData = state.playListData.filter((playlist) => playlist._id !== playlistId);
    });
    builder.addCase(deletePlaylist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Add video to playlist
    builder.addCase(addVideoToPlaylist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addVideoToPlaylist.fulfilled, (state, { payload, meta }) => {
      state.loading = false;
      const { playlistId, videoId } = meta.arg;

      if (payload.playlist) {
        // Find the playlist in playListData and update its videos
        const playlistIndex = state.playListData.findIndex((playlist) => playlist._id === playlistId);
        if (playlistIndex !== -1) {
          // Check if video is already in the playlist to avoid duplicates
          const videoExists = state.playListData[playlistIndex].videoId.some(
            (video) => video._id === videoId,
          );

          if (!videoExists && videoId) {
            // Need to get the video object from another playlist or update after getUserPlaylist
            // This is a temporary solution - in a real app you'd want to fetch the full video object
            state.playListData[playlistIndex].videoId = payload.playlist.videoId;
          }
        }
      }
    });
    builder.addCase(addVideoToPlaylist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Remove video from playlist
    builder.addCase(removeVideoFromPlaylist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeVideoFromPlaylist.fulfilled, (state, { payload, meta }) => {
      state.loading = false;
      const { playlistId, videoId } = meta.arg;

      // Find the playlist in playListData and remove the video
      const playlistIndex = state.playListData.findIndex((playlist) => playlist._id === playlistId);
      if (playlistIndex !== -1) {
        state.playListData[playlistIndex].videoId = state.playListData[playlistIndex].videoId.filter(
          (video) => video._id !== videoId,
        );
      }
    });
    builder.addCase(removeVideoFromPlaylist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Move video to different playlist
    builder.addCase(moveVideoToDifferentPlaylist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(moveVideoToDifferentPlaylist.fulfilled, (state, { payload, meta }) => {
      state.loading = false;
      const { sourcePlaylistId, targetPlaylistId, videoId } = meta.arg;

      // Find source playlist index
      const sourcePlaylistIndex = state.playListData.findIndex(
        (playlist) => playlist._id === sourcePlaylistId,
      );

      // Find target playlist index
      const targetPlaylistIndex = state.playListData.findIndex(
        (playlist) => playlist._id === targetPlaylistId,
      );

      if (sourcePlaylistIndex !== -1 && targetPlaylistIndex !== -1) {
        // Find the video object in the source playlist
        const videoToMove = state.playListData[sourcePlaylistIndex].videoId.find(
          (video) => video._id === videoId,
        );

        // Remove the video from source playlist
        state.playListData[sourcePlaylistIndex].videoId = state.playListData[
          sourcePlaylistIndex
        ].videoId.filter((video) => video._id !== videoId);

        // Check if video is already in target playlist
        const videoExistsInTarget = state.playListData[targetPlaylistIndex].videoId.some(
          (video) => video._id === videoId,
        );

        // Add the video to target playlist if it's not already there
        if (!videoExistsInTarget && videoToMove) {
          state.playListData[targetPlaylistIndex].videoId.push(videoToMove);
        }
      }
    });
    builder.addCase(moveVideoToDifferentPlaylist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default playlistSlice.reducer;

export const selectAllPlaylistName = (state) => state.playlist.AllPlaylistName;
export const selectPlayListData = (state) => state.playlist.playListData;
export const selectPlaylistLoading = (state) => state.playlist.loading;
export const selectPlaylistError = (state) => state.playlist.error;
