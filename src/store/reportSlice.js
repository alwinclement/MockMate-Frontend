import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchReport = createAsyncThunk(
  'report/fetch',
  async (sessionId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/reports/${sessionId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Report not ready yet');
    }
  }
);

export const fetchScoreHistory = createAsyncThunk(
  'report/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/reports/history');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load history');
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    current: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReportError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending,    (s) => { s.loading = true; s.error = null; })
      .addCase(fetchReport.fulfilled,  (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchReport.rejected,   (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchScoreHistory.fulfilled, (s, a) => { s.history = a.payload; });
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;