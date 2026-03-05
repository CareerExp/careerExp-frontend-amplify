import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  uploadingVideoData: null,
  uploadingThumbnailData: null,
  authorVideos: [],
  authorArticles: { articles: [], totalArticles: 0, currentPage: 1, totalPages: 0 },
  authorPodcasts: { podcasts: [], totalPodcasts: 0, currentPage: 1, totalPages: 0 },
  getGeneralStates: null,
  allVideos: [],
  creatorProfile: null,
  isFollowing: false, // changed from { isFollowing: false } to false
  followerCount: 0,
  CounsellorAnalytics: null,
  creatorDashboard: null,
  generalArticleData: null,
  generalPodcastData: null,
  invitations: [],
  myOrganization: null,
  currentMembership: null,
  loading: false,
  error: null,
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

export const getAuthorArticles = createAsyncThunk(
  "creator/getAuthorArticles",
  async ({ userId, page = 1, limit = 10, search = "" }, thunkAPI) => {
    const queryParams = new URLSearchParams({
      search: search || "",
      page: page.toString(),
      limit: limit.toString(),
    });
    try {
      return FetchApi.fetch(`${config.api}/api/creator/getauthorarticles/${userId}?${queryParams}`, {
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

export const getAuthorPodcasts = createAsyncThunk(
  "creator/getAuthorPodcasts",
  async ({ userId, page = 1, limit = 10, search = "" }, thunkAPI) => {
    const queryParams = new URLSearchParams({
      search: search || "",
      page: page.toString(),
      limit: limit.toString(),
    });
    try {
      return FetchApi.fetch(`${config.api}/api/creator/getauthorpodcasts/${userId}?${queryParams}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const deletePodcast = createAsyncThunk(
  "creator/deletePodcast",
  async ({ userId, podcastId, token }, thunkAPI) => {
    try {
      await FetchApi.fetch(`${config.api}/api/creator/deletepodcast/${userId}/${podcastId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return { podcastId };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const uploadPodcast = createAsyncThunk(
  "creator/uploadPodcast",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      const response = await fetch(`${config.api}/api/creator/uploadpodcast/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const uploadPodcastThumbnail = createAsyncThunk(
  "creator/uploadPodcastThumbnail",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      const response = await fetch(`${config.api}/api/creator/uploadpodcastthumbnail/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const uploadPodcastBanner = createAsyncThunk(
  "creator/uploadPodcastBanner",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      const response = await fetch(`${config.api}/api/creator/uploadpodcastbanner/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const addPodcastSpotify = createAsyncThunk(
  "creator/addPodcastSpotify",
  async ({ userId, body, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/addpodcastspotify/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const addPodcastManual = createAsyncThunk(
  "creator/addPodcastManual",
  async ({ userId, body, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/addpodcastmanual/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const getPodcastDetail = createAsyncThunk(
  "creator/getPodcastDetail",
  async ({ podcastId }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/podcast/${podcastId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const updatePodcast = createAsyncThunk(
  "creator/updatePodcast",
  async ({ userId, podcastId, body, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/updatepodcast/${userId}/${podcastId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const getArticleDetail = createAsyncThunk(
  "creator/getArticleDetail",
  async ({ articleId }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/article/${articleId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const uploadArticleCover = createAsyncThunk(
  "creator/uploadArticleCover",
  async ({ userId, formData, token }, thunkAPI) => {
    try {
      const response = await fetch(`${config.api}/api/creator/uploadarticlecover/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const addArticle = createAsyncThunk(
  "creator/addArticle",
  async ({ userId, payload, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/addarticle/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const updateArticle = createAsyncThunk(
  "creator/updateArticle",
  async ({ userId, articleId, payload, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/creator/updatearticle/${userId}/${articleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const deleteArticle = createAsyncThunk(
  "creator/deleteArticle",
  async ({ userId, articleId, token }, thunkAPI) => {
    try {
      await FetchApi.fetch(`${config.api}/api/creator/deletearticle/${userId}/${articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return { articleId };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const increaseArticleViewsCount = createAsyncThunk(
  "creator/increaseArticleViewsCount",
  async ({ articleId, userId }, thunkAPI) => {
    try {
      return FetchApi.fetch(
        `${config.api}/api/viewsAndShares/increasearticleviewscount/${articleId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userId ? { userId } : {}),
        },
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const increaseArticleSharesCount = createAsyncThunk(
  "creator/increaseArticleSharesCount",
  async ({ articleId, userId }, thunkAPI) => {
    try {
      return FetchApi.fetch(
        `${config.api}/api/viewsAndShares/increasearticlesharescount/${articleId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userId ? { userId } : {}),
        },
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const getArticleLikeStatus = createAsyncThunk(
  "creator/getArticleLikeStatus",
  async ({ articleId, userId, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(
        `${config.api}/api/like/getarticlelikestatus/${articleId}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const toggleArticleLike = createAsyncThunk(
  "creator/toggleArticleLike",
  async ({ articleId, userId, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/like/togglelikearticle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId, userId }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const getArticleRatingStatus = createAsyncThunk(
  "creator/getArticleRatingStatus",
  async ({ articleId, userId, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(
        `${config.api}/api/rating/getarticleratingstatus/${articleId}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const rateArticle = createAsyncThunk(
  "creator/rateArticle",
  async ({ articleId, userId, token, rating }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/rating/ratearticle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId, userId, rating }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

/** Podcast like/rating/views/shares – same pattern as articles (explore podcast detail). */
export const getPodcastLikeStatus = createAsyncThunk(
  "creator/getPodcastLikeStatus",
  async ({ podcastId, userId, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(
        `${config.api}/api/like/getpodcastlikestatus/${podcastId}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const togglePodcastLike = createAsyncThunk(
  "creator/togglePodcastLike",
  async ({ podcastId, userId, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/like/togglelikepodcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ podcastId, userId }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const getPodcastRatingStatus = createAsyncThunk(
  "creator/getPodcastRatingStatus",
  async ({ podcastId, userId, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(
        `${config.api}/api/rating/getpodcastratingstatus/${podcastId}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const ratePodcast = createAsyncThunk(
  "creator/ratePodcast",
  async ({ podcastId, userId, token, rating }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/rating/ratepodcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ podcastId, userId, rating }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const increasePodcastViewsCount = createAsyncThunk(
  "creator/increasePodcastViewsCount",
  async ({ podcastId, userId }, thunkAPI) => {
    try {
      return FetchApi.fetch(
        `${config.api}/api/viewsAndShares/increasepodcastviewscount/${podcastId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userId ? { userId } : {}),
        },
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const increasePodcastSharesCount = createAsyncThunk(
  "creator/increasePodcastSharesCount",
  async ({ podcastId, userId }, thunkAPI) => {
    try {
      return FetchApi.fetch(
        `${config.api}/api/viewsAndShares/increasepodcastsharescount/${podcastId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userId ? { userId } : {}),
        },
      );
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

/** GET /api/creator/dashboard/:userId – summary stats for counsellor dashboard. Auth required; userId must be current user. */
export const getCreatorDashboard = createAsyncThunk(
  "creator/getCreatorDashboard",
  async ({ userId, token }) => {
    const response = await FetchApi.fetch(
      `${config.api}/api/creator/dashboard/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.success === false) {
      throw new Error(response.message || "Failed to load dashboard");
    }
    return response.data != null ? response.data : response;
  }
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

export const getGeneralArticleData = createAsyncThunk(
  "creator/getGeneralArticleData",
  async ({ userId, token }) => {
    try {
      return await FetchApi.fetch(
        `${config.api}/api/creator/getgeneralarticledata/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

/** GET /api/creator/getgeneralpodcastdata/:userId – podcast analytics for Creator Analytics tab */
export const getGeneralPodcastData = createAsyncThunk(
  "creator/getGeneralPodcastData",
  async ({ userId, token }) => {
    try {
      return await FetchApi.fetch(
        `${config.api}/api/creator/getgeneralpodcastdata/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

export const getMyCompanyInvitations = createAsyncThunk(
  "creator/getMyCompanyInvitations",
  async ({ token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/creator/invitations`, {
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

export const respondToInvitation = createAsyncThunk(
  "creator/respondToInvitation",
  async ({ invitationId, organizationUserId, status, token }, thunkAPI) => {
    try {
      const endpoint = status === "accepted"
        ? "/api/creator/invitations/accept"
        : "/api/creator/invitations/reject";

      const response = await FetchApi.fetch(`${config.api}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invitationId, organizationUserId }),
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return { ...response, status };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

/** GET current creator membership (for leave button). Returns { data: { organizationUserId, _id?, ... } }. */
export const getCreatorCurrentMembership = createAsyncThunk(
  "creator/getCreatorCurrentMembership",
  async ({ token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/creator/invitations/me`, {
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

export const leaveOrganization = createAsyncThunk(
  "creator/leaveOrganization",
  async ({ organizationUserId, token }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(`${config.api}/api/creator/invitations/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizationUserId }),
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
    builder.addCase(getAuthorArticles.fulfilled, (state, { payload }) => {
      const data = payload?.data ?? payload;
      state.authorArticles = {
        articles: data?.articles ?? payload?.articles ?? [],
        totalArticles: data?.totalArticles ?? payload?.totalArticles ?? 0,
        currentPage: data?.currentPage ?? payload?.currentPage ?? 1,
        totalPages: data?.totalPages ?? payload?.totalPages ?? 0,
      };
    });
    builder.addCase(deleteArticle.fulfilled, (state, { payload }) => {
      if (state.authorArticles?.articles) {
        state.authorArticles.articles = state.authorArticles.articles.filter(
          (a) => a._id !== payload.articleId,
        );
        state.authorArticles.totalArticles = Math.max(0, (state.authorArticles.totalArticles ?? 1) - 1);
      }
    });
    builder.addCase(getAuthorPodcasts.fulfilled, (state, { payload }) => {
      const data = payload?.data ?? payload;
      state.authorPodcasts = {
        podcasts: data?.podcasts ?? payload?.podcasts ?? [],
        totalPodcasts: data?.totalPodcasts ?? payload?.totalPodcasts ?? 0,
        currentPage: data?.currentPage ?? payload?.currentPage ?? 1,
        totalPages: data?.totalPages ?? payload?.totalPages ?? 0,
      };
    });
    builder.addCase(deletePodcast.fulfilled, (state, { payload }) => {
      if (state.authorPodcasts?.podcasts) {
        state.authorPodcasts.podcasts = state.authorPodcasts.podcasts.filter(
          (p) => p._id !== payload.podcastId,
        );
        state.authorPodcasts.totalPodcasts = Math.max(0, (state.authorPodcasts.totalPodcasts ?? 1) - 1);
      }
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
    builder.addCase(getGeneralArticleData.fulfilled, (state, { payload }) => {
      state.generalArticleData = payload?.data ?? null;
    });
    builder.addCase(getGeneralPodcastData.fulfilled, (state, { payload }) => {
      state.generalPodcastData = payload?.data ?? payload ?? null;
    });

    builder.addCase(getMyCompanyInvitations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyCompanyInvitations.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.invitations = payload.data || [];
    });
    builder.addCase(getMyCompanyInvitations.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload?.error || "Failed to fetch invitations";
    });

    builder.addCase(respondToInvitation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(respondToInvitation.fulfilled, (state, { payload }) => {
      state.loading = false;
      // Remove the invitation from the list if it was accepted or rejected
      const invitationId = payload.data?._id || payload.invitationId;
      state.invitations = state.invitations.filter(
        (inv) => inv._id !== invitationId
      );
      if (payload.status === "accepted") {
        state.myOrganization = payload.data; // Store the full membership document
      }
    });
    builder.addCase(respondToInvitation.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload?.error || "Failed to respond to invitation";
    });

    builder.addCase(leaveOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(leaveOrganization.fulfilled, (state) => {
      state.loading = false;
      state.myOrganization = null;
      state.currentMembership = null;
    });
    builder.addCase(leaveOrganization.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload?.error || "Failed to leave organization";
    });

    builder.addCase(getCreatorCurrentMembership.fulfilled, (state, { payload }) => {
      state.currentMembership = payload?.data ?? payload ?? null;
    });
    builder.addCase(getCreatorCurrentMembership.rejected, (state) => {
      state.currentMembership = null;
    });

    builder.addCase(getCreatorDashboard.fulfilled, (state, { payload }) => {
      state.creatorDashboard = payload ?? null;
    });
  },
});

export const { resetState, resetVideoData } = creatorSlice.actions;

export const selectVideoLink = (state) => state.creator.uploadingVideoData;
export const selectThumbnailLink = (state) => state.creator.uploadingThumbnailData;
export const selectAuthorVideos = (state) => state.creator.authorVideos;
export const selectAuthorArticles = (state) => state.creator.authorArticles;
export const selectAuthorPodcasts = (state) => state.creator.authorPodcasts;
export const selectGeneralVideoData = (state) => state.creator.getGeneralStates;
export const selectAllVideosData = (state) => state.creator.allVideos;
export const selectCreatorProfile = (state) => state.creator.creatorProfile;
export const selectIsFollowing = (state) => state.creator.isFollowing;
export const selectFollowerCount = (state) => state.creator.followerCount;
export const selectCounsellorAnalytics = (state) => state.creator.CounsellorAnalytics;
export const selectCreatorDashboard = (state) => state.creator.creatorDashboard;
export const selectGeneralArticleData = (state) => state.creator.generalArticleData;
export const selectGeneralPodcastData = (state) => state.creator.generalPodcastData;
export const selectCreatorInvitations = (state) => state.creator.invitations;
export const selectMyOrganization = (state) => state.creator.myOrganization;
export const selectCurrentMembership = (state) => state.creator.currentMembership;
export const selectCreatorLoading = (state) => state.creator.loading;

export default creatorSlice.reducer;
