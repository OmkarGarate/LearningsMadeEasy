import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, tokenStore } from '../../api/client';

// Passkey registration
export const startRegistration = createAsyncThunk(
  'auth/startRegistration',
  async ({ username, displayName }, { rejectWithValue }) => {
    try { return await api.registerStart(username, displayName); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const finishRegistration = createAsyncThunk(
  'auth/finishRegistration',
  async ({ username, displayName, credential, challenge }, { rejectWithValue }) => {
    try {
      const data = await api.registerFinish(username, displayName, credential, challenge);
      tokenStore.set(data.accessToken, data.refreshToken);
      return data;
    } catch (err) { return rejectWithValue(err.message); }
  }
);

// Passkey login
export const startLogin = createAsyncThunk(
  'auth/startLogin',
  async ({ username }, { rejectWithValue }) => {
    try { return await api.loginStart(username); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const finishLogin = createAsyncThunk(
  'auth/finishLogin',
  async ({ credential, challenge }, { rejectWithValue }) => {
    try {
      const data = await api.loginFinish(credential, challenge);
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

export const deleteCredential = createAsyncThunk(
  'auth/deleteCredential',
  async (id, { rejectWithValue }) => {
    try { return await api.deleteCredential(id); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

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
      .addCase(startRegistration.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(startRegistration.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; })
      .addCase(startRegistration.fulfilled, (state) => { state.status = 'idle'; })

      .addCase(finishRegistration.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(finishRegistration.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
      })
      .addCase(finishRegistration.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; })

      .addCase(startLogin.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(startLogin.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; })
      .addCase(startLogin.fulfilled, (state) => { state.status = 'idle'; })

      .addCase(finishLogin.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(finishLogin.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
      })
      .addCase(finishLogin.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; })

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
      })

      .addCase(deleteCredential.fulfilled, (state, action) => {
        if (state.user) {
          state.user.credentials = action.payload.credentials;
        }
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthed = (state) => state.auth.status === 'authenticated';
export const selectAuthStatus = (state) => state.auth.status;
