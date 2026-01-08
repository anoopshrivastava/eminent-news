import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
    name : string,
    email: string,
    dob : Date,

}
interface userState {
    currentUser : User | null,
    isLoading : boolean,
    isAuthenticated : boolean,
    error : string | null
}
const initialState : userState = {
    currentUser : null,
    isLoading : false,
    isAuthenticated : false,
    error : null,
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        signInStart:(state)=>{
            state.isLoading = true;
        },
        signInSuccess:(state,action:PayloadAction<User>)=>{
            state.currentUser = action.payload;
            state.isLoading = false;
            state.isAuthenticated = true;
            state.error = null;
        },
        signInFailure:(state,action:PayloadAction<string>)=>{
            state.error = action.payload;
            state.isLoading = false;
        },
        signOutStart:(state)=>{
            state.isLoading = true;
        },
        signOutSuccess:(state)=>{
            state.isLoading=false;
            state.isAuthenticated = false;
            state.currentUser = null;
            state.error = null;
        },
        signOutFailure:(state,action)=>{
            state.isLoading=false;
            state.error=action.payload
        },
        updateUserSuccess: (state, action: PayloadAction<User>) => {
        if (state.currentUser) {
            state.currentUser = {
            ...state.currentUser,
            ...action.payload,
            };
        }
        },
    }
})

export const {signInFailure, signInStart, signInSuccess, signOutStart, signOutFailure, signOutSuccess, updateUserSuccess} = authSlice.actions;

export default authSlice.reducer