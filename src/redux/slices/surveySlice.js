import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  survey: [],
  clusterData: [],
  surveyQuestions: [],
};

export const saveSurveyData = createAsyncThunk(
  "survey/saveSurveyData",
  async ({ formData, userId, token }, { rejectWithValue }) => {
    const response = await FetchApi.fetch(`${config.api}/api/survey/savesurveyform1/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData }),
    });

    // Since client.js already parses the response, we can use it directly
    if (response instanceof Error) {
      return rejectWithValue({
        success: false,
        message: response.message || "Failed to save survey data",
      });
    }

    if (!response.success) {
      return rejectWithValue(response);
    }

    return response;
  },
);
export const getSurveyData = createAsyncThunk("survey/getSurveyData", async ({ userId, token }) => {
  return FetchApi.fetch(`${config.api}/api/survey/getsurveyform1/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
});

export const getCareerClusterOptions = createAsyncThunk(
  "survey/getCareerClusterOptions",
  async ({ token }) => {
    return FetchApi.fetch(`${config.api}/api/survey/getcareerclusteroptions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
);

export const getSurveyQuestions = createAsyncThunk("survey/getSurveyQuestions", async ({ token }) => {
  return FetchApi.fetch(`${config.api}/api/survey/getsurveyquestions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
});

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveSurveyData.fulfilled, (state, action) => {
      if (action.payload?.success) {
        state.survey = [...state.survey, action.payload];
      }
    });

    builder.addCase(getSurveyData.fulfilled, (state, action) => {
      state.survey = action.payload.surveyData;
    });

    builder.addCase(getCareerClusterOptions.fulfilled, (state, action) => {
      state.clusterData = action.payload.clusterData;
    });

    builder.addCase(getSurveyQuestions.fulfilled, (state, action) => {
      state.surveyQuestions = action.payload.questions;
    });
  },
});

export const selectSurvey = (state) => state.survey.survey;
export const selectClusterData = (state) => state.survey.clusterData;
export const selectSurveyQuestions = (state) => state.survey.surveyQuestions;
export default surveySlice.reducer;
