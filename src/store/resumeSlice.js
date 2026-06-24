import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const uploadResume = createAsyncThunk(
  'resume/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  }
);

export const fetchMyResumes = createAsyncThunk(
  'resume/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/resume/my');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    resumes: [],
    current: null,   // most recently uploaded/parsed resume
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending,    (s) => { s.loading = true;  s.error = null; })
      .addCase(uploadResume.fulfilled,  (s, a) => { s.loading = false; s.current = a.payload; s.resumes.unshift(a.payload); })
      .addCase(uploadResume.rejected,   (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMyResumes.fulfilled,(s, a) => { s.resumes = a.payload; });
  },
});

export const { clearCurrent } = resumeSlice.actions;
export default resumeSlice.reducer;