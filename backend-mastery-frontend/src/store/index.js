import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import progressReducer from './slices/progressSlice';
import remindersReducer from './slices/remindersSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    reminders: remindersReducer,
    user: userReducer,
  },
});
