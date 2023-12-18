import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import uploadReducer from './slices/uploadSlice';
import api from './api/api';

const reducer = {
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  upload: uploadReducer
}

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    api.middleware
  ],
  devTools: true
});
