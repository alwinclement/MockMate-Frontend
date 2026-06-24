import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/admin/users');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load users');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/api/admin/users/${userId}/role`, { role });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update role');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/admin/stats');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load stats');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllUsers.fulfilled, (s, a) => { s.loading = false; s.users = a.payload; })
      .addCase(fetchAllUsers.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateUserRole.fulfilled, (s, a) => {
        const idx = s.users.findIndex(u => u.id === a.payload.id);
        if (idx !== -1) s.users[idx] = a.payload;
      })
      .addCase(updateUserRole.rejected, (s, a) => { s.error = a.payload; })

      .addCase(deleteUser.fulfilled, (s, a) => {
        s.users = s.users.filter(u => u.id !== a.payload);
      })
      .addCase(deleteUser.rejected, (s, a) => { s.error = a.payload; })

      .addCase(fetchAdminStats.fulfilled, (s, a) => { s.stats = a.payload; });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;