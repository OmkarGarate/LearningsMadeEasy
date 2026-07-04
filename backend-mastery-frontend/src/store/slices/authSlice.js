import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, tokenStore } from '../../api/client';

// Direct code auth: a single secret code logs you in as "Omkar".
export const loginWithCode = createAsyncThunk(
  'auth/loginWithCode',
  async (code, { rejectWithValue }) => {
    try {
      const data = await api.loginWithCode(code);
      tokenStore.set(data.accessToken, data.refreshToken);
      return data;
    } catch (err) { return rejectWithValue(err.message); }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try { const data = await api.getMe(); return data.user; }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const refresh = tokenStore.getRefresh();
  try { if (refresh) await api.logout(refresh); } catch {}
  tokenStore.clear();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithCode.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginWithCode.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
      })
      .addCase(loginWithCode.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
      })

      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthed = (state) => state.auth.status === 'authenticated';
export const selectAuthStatus = (state) => state.auth.status;
