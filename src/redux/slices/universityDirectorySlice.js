import { createSlice } from "@reduxjs/toolkit";
import { getUniversityBySlug } from "../../api/partnersExploreApi.js";

export const initialUniversityDirectoryState = {
  university: null,
  loading: false,
  error: null,
  errorCode: null,
  claimSubmitting: false,
  claimError: null,
};

const universityDirectorySlice = createSlice({
  name: "universityDirectory",
  initialState: initialUniversityDirectoryState,
  reducers: {
    resetUniversityDirectory: () => ({ ...initialUniversityDirectoryState }),
    fetchUniversityStarted(state) {
      state.loading = true;
      state.error = null;
      state.errorCode = null;
    },
    fetchUniversitySucceeded(state, { payload }) {
      state.loading = false;
      state.university = payload;
      state.error = null;
      state.errorCode = null;
    },
    fetchUniversityFailed(state, { payload }) {
      state.loading = false;
      state.university = null;
      state.error = payload?.message ?? "Failed to load university";
      state.errorCode = payload?.code ?? null;
    },
    setClaimSubmitting(state, { payload }) {
      state.claimSubmitting = Boolean(payload);
    },
    setClaimError(state, { payload }) {
      state.claimError = payload ?? null;
    },
    setUniversityClaimStatus(state, { payload }) {
      if (state.university) {
        state.university = { ...state.university, claimStatus: payload };
      }
    },
    /** After successful claim registration while still on the page (viewer is now the pending claimant). */
    setUniversityPendingClaimForViewer(state) {
      if (state.university) {
        state.university = {
          ...state.university,
          claimStatus: "pending",
          pendingClaimAppliesToViewer: true,
        };
      }
    },
  },
});

export const {
  resetUniversityDirectory,
  fetchUniversityStarted,
  fetchUniversitySucceeded,
  fetchUniversityFailed,
  setClaimSubmitting,
  setClaimError,
  setUniversityClaimStatus,
  setUniversityPendingClaimForViewer,
} = universityDirectorySlice.actions;

export default universityDirectorySlice.reducer;

export const selectUniversity = (state) => state.university;
export const selectUniversityLoading = (state) => state.loading;
export const selectUniversityError = (state) => state.error;
export const selectUniversityErrorCode = (state) => state.errorCode;

/** For use with local useReducer state (same shape as slice state). Pass access token when logged in so pending-claim UX is viewer-specific. */
export async function fetchUniversityBySlug(slug, dispatch, token = null) {
  dispatch(fetchUniversityStarted());
  try {
    const res = await getUniversityBySlug(slug, token);
    if (res?.success && res.data) {
      dispatch(fetchUniversitySucceeded(res.data));
      return;
    }
    dispatch(
      fetchUniversityFailed({
        code: res?.code ?? null,
        message: res?.message ?? "Failed to load university",
      }),
    );
  } catch (err) {
    dispatch(
      fetchUniversityFailed({
        code: err?.apiCode ?? err?.code ?? null,
        message: err?.message ?? "Failed to load university",
      }),
    );
  }
}
