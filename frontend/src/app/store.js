import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import uploadReducer from './slices/uploadSlice';
import photoReducer from './slices/photoSlice'
import api from './api/api';
import { setupListeners } from '@reduxjs/toolkit/query';

const reducer = {
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  upload: uploadReducer,
  photo: photoReducer,
}

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    api.middleware
  ],
  devTools: true
});

setupListeners(store.dispatch);

const buildLoaders = (appApi, appStore) => {
  appApi.loaders = {}
  Object.keys(appApi.endpoints).forEach(endpointKey => {
    appApi.loaders[endpointKey] = async params => {
      const promise = appStore.dispatch(appApi.endpoints[endpointKey].initiate(params))
      await promise
      promise.unsubscribe()
    }
  })
}

buildLoaders(api, store)
