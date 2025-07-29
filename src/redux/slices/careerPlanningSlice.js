import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  careerPlanning: null,
};

export const getCareerPlanningStatus = createAsyncThunk(
  "careerPlanning/getCareerPlanningStatus",
  async ({ userId, token }, thunkAPI) => {
    try {
      return FetchApi.fetch(`${config.api}/api/careerPlanning/getcareerplanning/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const createCareerPlanning = createAsyncThunk(
  "careerPlanning/createCareerPlanning",
  async (
    { userId, token, careerOfInterest, educationalOptions, researchToDo, skillsToBuild, topCareerGoals },
    thunkAPI,
  ) => {
    try {
      return FetchApi.fetch(`${config.api}/api/careerPlanning/createcareerplanning`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          careerOfInterest,
          educationalOptions,
          researchToDo,
          skillsToBuild,
          topCareerGoals,
        }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const updateCareerPlanning = createAsyncThunk(
  "careerPlanning/updateCareerPlanning",
  async (
    { userId, token, careerOfInterest, educationalOptions, researchToDo, skillsToBuild, topCareerGoals },
    thunkAPI,
  ) => {
    try {
      // console.log(
      //   "userId",
      //   userId,
      //   "token",
      //   token,
      //   "careerOfInterest",
      //   careerOfInterest,
      //   "educationalOptions",
      //   educationalOptions,
      //   "researchToDo",
      //   researchToDo,
      //   "skillsToBuild",
      //   skillsToBuild,
      //   "topCareerGoals",
      //   topCareerGoals,
      // );
      return FetchApi.fetch(`${config.api}/api/careerPlanning/updatecareerplanning/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          careerOfInterest,
          educationalOptions,
          researchToDo,
          skillsToBuild,
          topCareerGoals,
        }),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

const careerPlanningSlice = createSlice({
  name: "careerPlanning",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCareerPlanningStatus.fulfilled, (state, action) => {
      //   state.careerPlanning = action.payload;
      console.log("action.payload", action.payload);
    });

    builder.addCase(createCareerPlanning.fulfilled, (state, action) => {
      state.careerPlanning = action.payload;
      //   console.log("action.payload", action.payload.data);
    });
  },
});

// export const selectCareerPlanning = (state) => state.careerPlanning.careerPlanning;

export default careerPlanningSlice.reducer;
