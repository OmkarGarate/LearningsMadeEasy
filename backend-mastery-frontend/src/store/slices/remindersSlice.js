import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const addReminder = createAsyncThunk(
  'reminders/add',
  async ({ text, datetime }, { rejectWithValue }) => {
    try { return await api.addReminder(text, datetime); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const toggleReminder = createAsyncThunk(
  'reminders/toggle',
  async (id, { rejectWithValue }) => {
    try { return await api.toggleReminder(id); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const deleteReminder = createAsyncThunk(
  'reminders/delete',
  async (id, { rejectWithValue }) => {
    try { return await api.deleteReminder(id); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

const remindersSlice = createSlice({
  name: 'reminders',
  initialState: { items: [], status: 'idle' },
  reducers: {
    setReminders: (state, action) => { state.items = action.payload || []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addReminder.fulfilled, (state, action) => { state.items = action.payload.reminders || []; })
      .addCase(toggleReminder.fulfilled, (state, action) => { state.items = action.payload.reminders || []; })
      .addCase(deleteReminder.fulfilled, (state, action) => { state.items = action.payload.reminders || []; });
  },
});

export const { setReminders } = remindersSlice.actions;
export default remindersSlice.reducer;
