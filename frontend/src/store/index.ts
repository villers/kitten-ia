import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import kittenReducer from './slices/kittenSlice';
import battleReducer from './slices/battleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kittens: kittenReducer,
    battles: battleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
