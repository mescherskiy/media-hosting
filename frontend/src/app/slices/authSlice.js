import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { user: JSON.parse(localStorage.getItem("user") || null) },
    reducers: {
        setCredentials: (state, action) => {
            const user = action.payload
            state.user = user
            localStorage.setItem("user", JSON.stringify(user))
        },
        logOut: (state) => {
            state.user = null;
            localStorage.removeItem("user")
        },
    },
})

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;