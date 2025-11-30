import { combineReducers,configureStore } from "@reduxjs/toolkit";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from "./authSlice";

const rootReducer = combineReducers({user : authReducer})

const persistConfig = {
    key: "root",
    storage,
    version:1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    // reducer : { 
    //     auth : authReducer  // if we add reducer like this it becomes null if we refresh so to get value even after refreshing we use persist Reducer that stores and gets value from local storage
    // }
    reducer : persistedReducer,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;