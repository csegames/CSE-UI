import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';
import { dataSlice } from './dataSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    data: dataSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
