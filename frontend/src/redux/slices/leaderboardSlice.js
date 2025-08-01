import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance';

const API_URL = "https://leaderboard-416l.onrender.com/api";

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/users?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const claimPoints = createAsyncThunk(
  'leaderboard/claimPoints',
  async ({ userId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.post(
        `${API_URL}/points/claim`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    users: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(claimPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimPoints.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(claimPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUsers } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
