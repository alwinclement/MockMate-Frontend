import { createSlice } from '@reduxjs/toolkit';

const liveInterviewSlice = createSlice({
  name: 'liveInterview',
  initialState: {
    sessionId: null,
    currentQuestion: null,   // full question object from server
    currentIndex: 0,
    totalQuestions: 0,
    timeRemaining: 120,
    status: 'IDLE',          // IDLE | CONNECTING | ACTIVE | COMPLETED
    answers: [],             // answers submitted this session
    timedOutCount: 0,
    totalAnswered: 0,
    error: null,
  },
  reducers: {
    setSessionId(state, action) {
      state.sessionId = action.payload;
      state.status = 'CONNECTING';
    },
    receiveQuestion(state, action) {
      const payload = action.payload;
      state.status = 'ACTIVE';
      state.currentQuestion = {
        id: payload.questionId,
        content: payload.questionContent,
        type: payload.questionType,
        difficulty: payload.difficulty,
        hint: payload.hint,
      };
      state.currentIndex = payload.currentIndex;
      state.totalQuestions = payload.totalQuestions;
      state.timeRemaining = payload.timeRemainingSeconds;
    },
    tickTimer(state) {
      if (state.timeRemaining > 0) state.timeRemaining -= 1;
    },
    answerSubmitted(state, action) {
      state.answers.push(action.payload);
    },
    sessionCompleted(state, action) {
      state.status = 'COMPLETED';
      state.totalAnswered = action.payload.totalAnswered;
      state.timedOutCount = action.payload.timedOutCount;
      state.currentQuestion = null;
    },
    resetLiveSession(state) {
      state.sessionId = null;
      state.currentQuestion = null;
      state.currentIndex = 0;
      state.totalQuestions = 0;
      state.timeRemaining = 120;
      state.status = 'IDLE';
      state.answers = [];
      state.timedOutCount = 0;
      state.totalAnswered = 0;
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
      state.status = 'IDLE';
    },
  },
});

export const {
  setSessionId, receiveQuestion, tickTimer,
  answerSubmitted, sessionCompleted, resetLiveSession, setError
} = liveInterviewSlice.actions;

export default liveInterviewSlice.reducer;