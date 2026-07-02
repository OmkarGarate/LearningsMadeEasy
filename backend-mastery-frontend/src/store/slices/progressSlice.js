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

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    completed: {}, // { conceptId: timestamp }
    notes: {},     // { conceptId: text }
    saving: false,
    lastSavedAt: null,
  },
  reducers: {
    setProgress: (state, action) => {
      state.completed = action.payload.completed || {};
      state.notes = action.payload.notes || {};
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

export const { setProgress } = progressSlice.actions;
export default progressSlice.reducer;
