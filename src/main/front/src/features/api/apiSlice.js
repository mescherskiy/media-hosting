import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials, logout } from "../auth/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error.originalStatus === 403) {
        console.log("Sending refresh token")
        const refreshResult = await baseQuery("/refresh", api, extraOptions)
        console.log(refreshResult)

        if (refreshResult?.data) {
            const userEmail = api.getState().auth.email
            const username = api.getState().auth.username

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data, userEmail}))

            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: "/login",
                method: "POST",
                body: { ...credentials }
            })
        })
    })
})

export const { useLoginMutation } = apiSlice