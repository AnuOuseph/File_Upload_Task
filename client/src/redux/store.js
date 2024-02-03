import {configureStore} from '@reduxjs/toolkit';
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from "redux-persist";
import userReducer from './userSlice'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const reducer = combineReducers({
    user: userReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer )

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [ REGISTER, FLUSH, PURGE, PAUSE, PERSIST, REHYDRATE ]
        }
      }),
})
export default store