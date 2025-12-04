import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from './authSlice';
import roundsReducer from './roundsSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    rounds: roundsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;