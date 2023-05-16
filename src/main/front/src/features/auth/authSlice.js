import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { username: null, email: null, token: null },
    reducers: {
        setCredentials: (state, action) => {
            console.log("setCredentials action.payload:")
            console.log(action.payload)
            const { name, sub, accessToken } = action.payload
            state.username = name
            state.email = sub
            state.token = accessToken
        },
        logout: (state, action) => {
            state.username = null
            state.email = null
            state.token = null
        }
    },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
export const selectCurrentUsername = state => state.auth.username
export const selectCurrentUserEmail = state => state.auth.email
export const selectCurrentToken = state => state.auth.token