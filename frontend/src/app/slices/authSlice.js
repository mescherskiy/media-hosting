import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authenticated: localStorage.getItem("authenticated") === "true",
    notify: false,
    notificationMessage: "",
    greenNotification: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logIn: (state) => {
            state.authenticated = true
            localStorage.setItem("authenticated", "true")
        },
        logOut: (state) => {
            state.authenticated = false
            localStorage.setItem("authenticated", "false")
        },
        showNotification: (state, action) => {
            state.notify = action.payload
        },
        setNotificationMessage: (state, action) => {
            state.notificationMessage = action.payload
        },
        setGreenNotification: (state, action) => {
            state.greenNotification = action.payload
        }
    },
})

export const { logIn, logOut, showNotification, setNotificationMessage, setGreenNotification } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth.authenticated;
export const selectNotify = (state) => state.auth.notify;
export const selectNotificationMessage = (state) => state.auth.notificationMessage;
export const selectGreenNotification = (state) => state.auth.greenNotification;