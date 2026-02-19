import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import adminReducer from "./slices/adminSlice.js";
import alertReducer from "./slices/alertSlice.js";
import authReducer from "./slices/authSlice.js";
import careerPlanningSlice from "./slices/careerPlanningSlice.js";
import creatorReducer from "./slices/creatorSlice.js";
import discSlice from "./slices/discSlice.js";
import exploreSlice from "./slices/exploreSlice.js";
import interestSlice from "./slices/interestSlice.js";
import inviteReducer from "./slices/inviteSlice";
import likeSlice from "./slices/likeSlice.js";
import onetSlice from "./slices/onetSlice.js";
import paymentSlice from "./slices/paymentSlice.js";
import playlistSlice from "./slices/playlistSlice.js";
import profileReducer from "./slices/profileSlice.js";
import ratingSlice from "./slices/ratingSlice.js";
import resumeReducer from "./slices/resumeSlice.js";
import schoolContactSlice from "./slices/schoolContactSlice.js";
import surveySlice from "./slices/surveySlice.js";
import unifiedRecordSlice from "./slices/unifiedRecordSlice.js";
import userDetailsSlice from "./slices/userDetailsSlice.js";
import userHistorySlice from "./slices/userHistory.js";
import userSlice from "./slices/userSlice.js";
import zylaSlice from "./slices/zylaSlice.js";
import organizationSlice from "./slices/organizationSlice.js";
import subscriptionSlice from "./slices/subscriptionSlice.js";
import ameContextSlice from "./slices/ameContextSlice.js";
import announcementSlice from "./slices/announcementSlice.js";
import eventSlice from "./slices/eventSlice.js";
import serviceSlice from "./slices/serviceSlice.js";
import courseSlice from "./slices/courseSlice.js";
import followerSlice from "./slices/followerSlice.js";
import messageSlice from "./slices/messageSlice.js";

const persistConfig = {
  key: "user",
  version: 1,
  storage,
};

// Combine all your reducers into a root reducer
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  alert: alertReducer,
  admin: adminReducer,
  invite: inviteReducer,
  profile: profileReducer,
  creator: creatorReducer,
  onet: onetSlice,
  user: userSlice,
  zyla: zylaSlice,
  survey: surveySlice,
  unifiedRecord: unifiedRecordSlice,
  userDetails: userDetailsSlice,
  resume: resumeReducer,
  disc: discSlice,
  interest: interestSlice,
  explore: exploreSlice,
  like: likeSlice,
  rating: ratingSlice,
  history: userHistorySlice,
  playlist: playlistSlice,
  schoolContact: schoolContactSlice,
  payment: paymentSlice,
  careerPlanning: careerPlanningSlice,
  ameContext: ameContextSlice,
  organization: organizationSlice,
  subscription: subscriptionSlice,
  announcement: announcementSlice,
  event: eventSlice,
  service: serviceSlice,
  course: courseSlice,
  follower: followerSlice,
  message: messageSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  preloadedState: {},
});

const persistor = persistStore(store);

export { store, persistor };
