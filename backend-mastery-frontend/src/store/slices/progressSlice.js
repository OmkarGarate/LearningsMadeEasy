import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const toggleConcept = createAsyncThunk(
  'progress/toggle',
  async (conceptId, { rejectWithValue }) => {
    try { return await api.toggleConcept(conceptId); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const saveNote = createAsyncThunk(
  'progress/saveNote',
  async ({ conceptId, text }, { rejectWithValue }) => {
    try { return await api.setNote(conceptId, text); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const recordMcqAnswerThunk = createAsyncThunk(
  'progress/recordMcqAnswer',
  async ({ conceptId, mcqId, selected, correct }, { rejectWithValue }) => {
    try { return await api.recordMcqAnswer({ conceptId, mcqId, selected, correct }); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const recordProblemSolvedThunk = createAsyncThunk(
  'progress/recordProblemSolved',
  async ({ conceptId, problemTitle }, { rejectWithValue }) => {
    try { return await api.markProblemSolved(conceptId, problemTitle); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    completed: {},
    notes: {},
    saving: false,
    lastSavedAt: null,
    mcqAnswers: {},        // { conceptId: { mcqId: { selected, correct } } }
    solvedProblems: [],     // ["conceptId::problemTitle", ...]
    quizCorrect: 0,
    problemsSolved: 0,
  },
  reducers: {
    setProgress: (state, action) => {
      state.completed = action.payload.completed || {};
      state.notes = action.payload.notes || {};
      state.mcqAnswers = action.payload.mcqAnswers || {};
      state.solvedProblems = action.payload.solvedProblems || [];
      state.quizCorrect = action.payload.quizCorrect || 0;
      state.problemsSolved = action.payload.problemsSolved || 0;
    },
    addXp: (state) => {},
    recordMcqAnswer: (state, action) => {
      const { conceptId, mcqId, selected, correct } = action.payload;
      if (!state.mcqAnswers[conceptId]) state.mcqAnswers[conceptId] = {};
      if (selected === null) delete state.mcqAnswers[conceptId][mcqId];
      else state.mcqAnswers[conceptId][mcqId] = { selected, correct };
      let total = 0;
      Object.values(state.mcqAnswers).forEach(answers => {
        Object.values(answers).forEach(a => { if (a?.correct) total++; });
      });
      state.quizCorrect = total;
    },
    recordProblemSolved: (state, action) => {
      const { conceptId, problemTitle } = action.payload;
      const key = `${conceptId}::${problemTitle}`;
      if (!state.solvedProblems.includes(key)) {
        state.solvedProblems.push(key);
        state.problemsSolved = state.solvedProblems.length;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleConcept.fulfilled, (state, action) => {
        const u = action.payload.user;
        if (u) {
          state.completed = u.progress || {};
          state.notes = u.notes || {};
        }
      })
      .addCase(saveNote.pending, (state) => { state.saving = true; })
      .addCase(saveNote.fulfilled, (state, action) => {
        state.saving = false;
        state.notes = action.payload.notes || state.notes;
        state.lastSavedAt = Date.now();
      })
      .addCase(saveNote.rejected, (state) => { state.saving = false; });
  },
});

export const { setProgress, addXp, recordMcqAnswer, recordProblemSolved } = progressSlice.actions;
export default progressSlice.reducer;
