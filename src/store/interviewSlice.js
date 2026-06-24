import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const startInterview = createAsyncThunk(
  'interview/start',
  async ({ resumeId, jobRole }, { rejectWithValue }) => {
    try {
      // POST body matches InterviewRequestDto exactly
      const res = await axiosInstance.post('/api/interviews/start', {
        resumeId,   // Long
        jobRole,    // "BACKEND_ENGINEER" etc.
      });
      return res.data; // InterviewSessionDto
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate questions');
    }
  }
);

export const fetchMySessions = createAsyncThunk(
  'interview/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/interviews/my');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    sessions: [],
    currentSession: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentSession(state) { state.currentSession = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startInterview.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(startInterview.fulfilled, (s, a) => {
        s.loading = false;
        s.currentSession = a.payload; // full InterviewSessionDto stored here
        s.sessions.unshift(a.payload);
      })
      .addCase(startInterview.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMySessions.fulfilled,(s, a) => { s.sessions = a.payload; });
  },
});

export const { clearCurrentSession, clearError } = interviewSlice.actions;
export default interviewSlice.reducer;