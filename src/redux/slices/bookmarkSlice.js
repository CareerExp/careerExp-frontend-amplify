/**
 * Bookmark slice: user bookmarks for articles, podcasts, and courses (no playlists).
 * The app does NOT expect isBookmarked on article/podcast/course detail responses.
 * Bookmark state on detail pages comes from the .../status endpoints below.
 *
 * BACKEND APIs required (all require Authorization: Bearer <token>):
 *
 * 1. GET  /api/user/bookmarks/articles
 *    Response: { data: Article[] } or { articles: Article[] }
 *    Article: { _id, title, coverImage?, thumbnail?, ... }
 *
 * 2. GET  /api/user/bookmarks/podcasts
 *    Response: { data: Podcast[] } or { podcasts: Podcast[] }
 *    Podcast: { _id, title, thumbnail?, bannerImage?, ... }
 *
 * 3. GET  /api/user/bookmarks/article/:articleId/status
 *    Response: { bookmarked: boolean }
 *
 * 4. GET  /api/user/bookmarks/podcast/:podcastId/status
 *    Response: { bookmarked: boolean }
 *
 * 5. POST /api/user/bookmarks/article
 *    Body: { articleId: string }
 *
 * 6. DELETE /api/user/bookmarks/article/:articleId
 *
 * 7. POST /api/user/bookmarks/podcast
 *    Body: { podcastId: string }
 *
 * 8. DELETE /api/user/bookmarks/podcast/:podcastId
 *
 * 9. GET  /api/user/bookmarks/courses
 *    Response: { data: Course[] } or { courses: Course[] }
 *    Course: { _id, title, thumbnail?, image?, ... }
 *
 * 10. POST /api/user/bookmarks/course
 *     Body: { courseId: string }
 *
 * 11. DELETE /api/user/bookmarks/course/:courseId
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  bookmarkedArticles: [],
  bookmarkedPodcasts: [],
  bookmarkedCourses: [],
  articleBookmarkStatus: {}, // { [articleId]: boolean }
  podcastBookmarkStatus: {}, // { [podcastId]: boolean }
  courseBookmarkStatus: {}, // { [courseId]: boolean }
  loading: false,
  error: null,
};

/** GET /api/user/bookmarks/articles – list bookmarked articles for the current user */
export const getBookmarkedArticles = createAsyncThunk(
  "bookmark/getBookmarkedArticles",
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await FetchApi.fetch(`${config.api}/api/user/bookmarks/articles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res?.data ?? res?.articles ?? [];
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to load bookmarked articles");
    }
  },
);

/** GET /api/user/bookmarks/podcasts – list bookmarked podcasts for the current user */
export const getBookmarkedPodcasts = createAsyncThunk(
  "bookmark/getBookmarkedPodcasts",
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await FetchApi.fetch(`${config.api}/api/user/bookmarks/podcasts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res?.data ?? res?.podcasts ?? [];
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to load bookmarked podcasts");
    }
  },
);

/** GET /api/user/bookmarks/article/:articleId/status – { bookmarked: boolean } */
export const getArticleBookmarkStatus = createAsyncThunk(
  "bookmark/getArticleBookmarkStatus",
  async ({ articleId, token }, { rejectWithValue }) => {
    try {
      const res = await FetchApi.fetch(
        `${config.api}/api/user/bookmarks/article/${articleId}/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const bookmarked = res?.bookmarked ?? res?.data?.bookmarked ?? false;
      return { articleId, bookmarked };
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to get bookmark status");
    }
  },
);

/** GET /api/user/bookmarks/podcast/:podcastId/status – { bookmarked: boolean } */
export const getPodcastBookmarkStatus = createAsyncThunk(
  "bookmark/getPodcastBookmarkStatus",
  async ({ podcastId, token }, { rejectWithValue }) => {
    try {
      const res = await FetchApi.fetch(
        `${config.api}/api/user/bookmarks/podcast/${podcastId}/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const bookmarked = res?.bookmarked ?? res?.data?.bookmarked ?? false;
      return { podcastId, bookmarked };
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to get bookmark status");
    }
  },
);

/** POST /api/user/bookmarks/article – body: { articleId } */
export const addArticleBookmark = createAsyncThunk(
  "bookmark/addArticleBookmark",
  async ({ articleId, token }, { rejectWithValue }) => {
    try {
      await FetchApi.fetch(`${config.api}/api/user/bookmarks/article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId }),
      });
      return { articleId, bookmarked: true };
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to bookmark article");
    }
  },
);

/** DELETE /api/user/bookmarks/article/:articleId */
export const removeArticleBookmark = createAsyncThunk(
  "bookmark/removeArticleBookmark",
  async ({ articleId, token }, { rejectWithValue }) => {
    try {
      await FetchApi.fetch(
        `${config.api}/api/user/bookmarks/article/${articleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return { articleId, bookmarked: false };
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to remove bookmark");
    }
  },
);

/** POST /api/user/bookmarks/podcast – body: { podcastId } */
export const addPodcastBookmark = createAsyncThunk(
  "bookmark/addPodcastBookmark",
  async ({ podcastId, token }, { rejectWithValue }) => {
    try {
      await FetchApi.fetch(`${config.api}/api/user/bookmarks/podcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ podcastId }),
      });
      return { podcastId, bookmarked: true };
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to bookmark podcast");
    }
  },
);

/** DELETE /api/user/bookmarks/podcast/:podcastId */
export const removePodcastBookmark = createAsyncThunk(
  "bookmark/removePodcastBookmark",
  async ({ podcastId, token }, { rejectWithValue }) => {
    try {
      await FetchApi.fetch(
        `${config.api}/api/user/bookmarks/podcast/${podcastId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return { podcastId, bookmarked: false };
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to remove bookmark");
    }
  },
);

/** GET /api/user/bookmarks/courses – list bookmarked courses for the current user */
export const getBookmarkedCourses = createAsyncThunk(
  "bookmark/getBookmarkedCourses",
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await FetchApi.fetch(`${config.api}/api/user/bookmarks/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res?.data ?? res?.courses ?? [];
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to load bookmarked courses");
    }
  },
);

/** POST /api/user/bookmarks/course – body: { courseId } */
export const addCourseBookmark = createAsyncThunk(
  "bookmark/addCourseBookmark",
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      await FetchApi.fetch(`${config.api}/api/user/bookmarks/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });
      return { courseId, bookmarked: true };
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to bookmark course");
    }
  },
);

/** DELETE /api/user/bookmarks/course/:courseId */
export const removeCourseBookmark = createAsyncThunk(
  "bookmark/removeCourseBookmark",
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      await FetchApi.fetch(
        `${config.api}/api/user/bookmarks/course/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return { courseId, bookmarked: false };
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to remove bookmark");
    }
  },
);

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    clearBookmarkError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookmarkedArticles.fulfilled, (state, action) => {
        state.bookmarkedArticles = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getBookmarkedPodcasts.fulfilled, (state, action) => {
        state.bookmarkedPodcasts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getArticleBookmarkStatus.fulfilled, (state, action) => {
        const { articleId, bookmarked } = action.payload;
        state.articleBookmarkStatus[articleId] = bookmarked;
      })
      .addCase(getPodcastBookmarkStatus.fulfilled, (state, action) => {
        const { podcastId, bookmarked } = action.payload;
        state.podcastBookmarkStatus[podcastId] = bookmarked;
      })
      .addCase(addArticleBookmark.fulfilled, (state, action) => {
        const { articleId, bookmarked } = action.payload;
        state.articleBookmarkStatus[articleId] = bookmarked;
      })
      .addCase(removeArticleBookmark.fulfilled, (state, action) => {
        const { articleId, bookmarked } = action.payload;
        state.articleBookmarkStatus[articleId] = bookmarked;
        state.bookmarkedArticles = state.bookmarkedArticles.filter(
          (a) => (a._id || a.id) !== articleId,
        );
      })
      .addCase(addPodcastBookmark.fulfilled, (state, action) => {
        const { podcastId, bookmarked } = action.payload;
        state.podcastBookmarkStatus[podcastId] = bookmarked;
      })
      .addCase(removePodcastBookmark.fulfilled, (state, action) => {
        const { podcastId, bookmarked } = action.payload;
        state.podcastBookmarkStatus[podcastId] = bookmarked;
        state.bookmarkedPodcasts = state.bookmarkedPodcasts.filter(
          (p) => (p._id || p.id) !== podcastId,
        );
      })
      .addCase(getBookmarkedCourses.fulfilled, (state, action) => {
        const list = Array.isArray(action.payload) ? action.payload : [];
        state.bookmarkedCourses = list;
        list.forEach((c) => {
          const id = c._id || c.id;
          if (id) state.courseBookmarkStatus[id] = true;
        });
      })
      .addCase(addCourseBookmark.fulfilled, (state, action) => {
        const { courseId, bookmarked } = action.payload;
        state.courseBookmarkStatus[courseId] = bookmarked;
      })
      .addCase(removeCourseBookmark.fulfilled, (state, action) => {
        const { courseId } = action.payload;
        state.courseBookmarkStatus[courseId] = false;
        state.bookmarkedCourses = state.bookmarkedCourses.filter(
          (c) => (c._id || c.id) !== courseId,
        );
      });
  },
});

export const { clearBookmarkError } = bookmarkSlice.actions;

export const selectBookmarkedArticles = (state) => state.bookmark.bookmarkedArticles;
export const selectBookmarkedPodcasts = (state) => state.bookmark.bookmarkedPodcasts;
export const selectBookmarkedCourses = (state) => state.bookmark.bookmarkedCourses;
export const selectArticleBookmarkStatus = (state, articleId) =>
  state.bookmark.articleBookmarkStatus[articleId] ?? false;
export const selectPodcastBookmarkStatus = (state, podcastId) =>
  state.bookmark.podcastBookmarkStatus[podcastId] ?? false;

export default bookmarkSlice.reducer;
