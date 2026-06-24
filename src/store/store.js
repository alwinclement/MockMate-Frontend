import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import resumeReducer from './resumeSlice';  
import interviewReducer from './interviewSlice';
import liveInterviewReducer from './liveInterviewSlice';
import reportReducer from './reportSlice';
import adminReducer from './adminSlice';



export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer, 
    interview: interviewReducer,
    liveInterview: liveInterviewReducer,
    report: reportReducer,
    admin: adminReducer,
    
  },
});