import { configureStore } from '@reduxjs/toolkit';
import { waterSlice } from './features/water';

export const store = configureStore({ reducer: { water: waterSlice.reducer } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
