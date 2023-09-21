import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { logOut } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
    // baseUrl: "http://localhost:8080/api",
    // baseUrl: "https://media-hosting-beedbd9a2f9f.herokuapp.com/api",
    baseUrl: "/api/",
    credentials: "include",
})

const baseQueryWithReauth = async (args, api, extraOptions) => {

    let response = await baseQuery(args, api, extraOptions);

    const error = response.error
    if (error) {
        if (error.status === 403) {
            const refreshResponse = await baseQuery("auth/refreshtoken", api, extraOptions);
            if (refreshResponse?.data) {
                response = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logOut());
            }
        } else {
            api.dispatch(logOut());
        }
    }

    // else if (response?.error?.status === 401) {
    //     console.log(response)
    //     console.log("Status 401! Logging out")
    //     api.dispatch(logOut())
    // }
    return response;
}

const api = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        registration: builder.mutation({
            query: credentials => ({
                url: "auth/signup",
                method: "POST",
                body: { ...credentials }
            })
        }),
        login: builder.mutation({
            query: credentials => ({
                url: "auth/signin",
                method: "POST",
                body: { ...credentials }
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "auth/signout",
                method: "POST",
            }),
            onQueryStarted: (_, { dispatch }) => {
                dispatch(logOut())
            }
        }),
        getPublicContent: builder.query({
            query: () => ({
                url: "test/all",
                method: "GET"
            })
        }),
        getUserBoard: builder.query({
            query: () => ("test/user")
        }),
        getAdminBoard: builder.query({
            query: () => ("test/admin")
        }),
        uploadPhoto: builder.mutation({
            query: ({ email, file }) => ({
                url: `vault/${email}/upload`,
                method: "POST",
                body: file
            }),
        }),
        getUserPhotos: builder.query({
            query: username => `vault/${username}`
        }),
    })
})

export const {
    useLoginMutation,
    useRegistrationMutation,
    useLogoutMutation,
    useGetUserBoardQuery,
    useGetPublicContentQuery,
    useGetAdminBoardQuery,
    useGetUserPhotosQuery,
    useUploadPhotoMutation
} = api;

export default api;