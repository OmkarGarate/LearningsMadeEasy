import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const setPreferences = createAsyncThunk(
  'user/setPreferences',
  async (prefs, { rejectWithValue }) => {
    try { return await api.setPreferences(prefs); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const syncBadges = createAsyncThunk(
  'user/syncBadges',
  async (badges, { rejectWithValue }) => {
    try { return await api.syncBadges(badges); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    streak: 0,
    xp: 0,
    earnedBadges: [],
    preferences: { dailyReminderTime: '19:00' },
  },
  reducers: {
    setUserData: (state, action) => {
      const { streak, xp, earnedBadges, preferences } = action.payload;
      if (streak != null) state.streak = streak;
      if (xp != null) state.xp = xp;
      if (earnedBadges) state.earnedBadges = earnedBadges;
      if (preferences) state.preferences = preferences;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setPreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload.preferences };
      })
      .addCase(syncBadges.fulfilled, (state, action) => {
        state.earnedBadges = action.payload.earnedBadges || [];
      });
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
