import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { authenticated: false },
    reducers: {
        logIn: (state) => {
            state.authenticated = true
        },
        logOut: (state) => {
            state.authenticated = false;
        },
    },
})

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth.authenticated;