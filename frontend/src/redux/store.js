import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leaderboardReducer from './slices/leaderboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leaderboard: leaderboardReducer,
  },
});