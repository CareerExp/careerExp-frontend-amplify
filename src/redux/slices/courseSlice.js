import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchApi from "../../client.js";
import { config } from "../../config/config.js";
import { getActingAsHeader } from "../../utility/getActingAsHeader.js";

const initialState = {
  myCourses: [],
  totalCourses: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
};

/** GET /api/courses/me – list my courses (search, pagination, status filter) */
export const fetchMyCourses = createAsyncThunk(
  "course/fetchMyCourses",
  async ({ token, page = 1, limit = 12, search = "", status = "" }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const queryParams = new URLSearchParams();
      queryParams.append("page", String(page));
      queryParams.append("limit", String(limit));
      if (search) queryParams.append("search", search);
      if (status) queryParams.append("status", status);

      const url = `${config.api}/api/courses/me?${queryParams.toString()}`;
      const response = await FetchApi.fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return {
        data: response.data || [],
        totalCourses: response.totalCourses ?? 0,
        currentPage: response.currentPage ?? 1,
        totalPages: response.totalPages ?? 0,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

/** POST /api/courses – create course (FormData or JSON) */
export const createCourse = createAsyncThunk(
  "course/createCourse",
  async ({ formData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/courses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
        body: formData,
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

/** PUT /api/courses/:id – update course */
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ id, formData, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/courses/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
        body: formData,
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

/** GET /api/courses/:id – get course by id */
export const getCourseById = createAsyncThunk(
  "course/getCourseById",
  async ({ id, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/courses/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

/** DELETE /api/courses/:id */
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({ id, token }, thunkAPI) => {
    try {
      const actingAs = getActingAsHeader(thunkAPI.getState);
      const response = await FetchApi.fetch(`${config.api}/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...actingAs,
        },
      });

      if (!response.success) {
        return thunkAPI.rejectWithValue({ error: response.message });
      }
      return { id, ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myCourses = payload.data || [];
        state.totalCourses = payload.totalCourses ?? 0;
        state.currentPage = payload.currentPage ?? 1;
        state.totalPages = payload.totalPages ?? 0;
      })
      .addCase(fetchMyCourses.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to fetch courses";
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCourse.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to create course";
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCourse.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to update course";
      })
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myCourses = state.myCourses.filter((c) => c._id !== payload.id);
        state.totalCourses = Math.max(0, (state.totalCourses || 1) - 1);
      })
      .addCase(deleteCourse.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error || "Failed to delete course";
      });
  },
});

export const selectMyCourses = (state) => state.course.myCourses;
export const selectCourseLoading = (state) => state.course.loading;
export const selectCourseError = (state) => state.course.error;
export const selectCoursePagination = (state) => ({
  totalCourses: state.course.totalCourses,
  currentPage: state.course.currentPage,
  totalPages: state.course.totalPages,
});

export default courseSlice.reducer;
