import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice.js";

const initialState = {
  actingAsOrganizationId: null,
  actingAsOrganizationName: null,
};

const ameContextSlice = createSlice({
  name: "ameContext",
  initialState,
  reducers: {
    setActingAsAME: (state, action) => {
      const { organizationProfileId, organizationName } = action.payload || {};
      state.actingAsOrganizationId = organizationProfileId ?? null;
      state.actingAsOrganizationName = organizationName ?? null;
    },
    clearActingAsAME: (state) => {
      state.actingAsOrganizationId = null;
      state.actingAsOrganizationName = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setActingAsAME, clearActingAsAME } = ameContextSlice.actions;

export const selectActingAsOrganizationId = (state) => state.ameContext?.actingAsOrganizationId;
export const selectActingAsOrganizationName = (state) => state.ameContext?.actingAsOrganizationName;
export const selectIsActingAsAME = (state) => Boolean(state.ameContext?.actingAsOrganizationId);

export default ameContextSlice.reducer;
