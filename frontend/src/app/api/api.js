import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { logOut } from "../slices/authSlice";
import { setUploadProgress } from "../slices/uploadSlice";

import axios from "axios";

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
        deleteUser: builder.mutation({
            query: id => ({
                url: `user/${id}/delete`,
                method: "POST",
            })
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
            // query: ({ email, file }) => ({
            //     url: `vault/${email}/upload`,
            //     method: "POST",
            //     body: file,    
            // }),
            // queryFn: async ({ options, input, context }) => {
            //     const { email, file } = input;
            //     const { url, method, body } = options;
            
            //     const formData = new FormData();
            //     formData.append("file", file);
            
            //     const axiosConfig = {
            //       method,
            //       url,
            //       data: formData,
            //       onUploadProgress: (progressEvent) => {
            //         if (progressEvent.lengthComputable) {
            //           const percentCompleted = Math.round(
            //             (progressEvent.loaded / progressEvent.total) * 100
            //           );
            //           context.updateProgress(percentCompleted);
            //         }
            //       },
            //     };
            
            //     const response = await axios(axiosConfig);
            //     return response.data;
            //   },
            queryFn: async ({email, file}, api) => {
                try {
                    const result = await axios.post(`/api/vault/${email}/upload`, file, {
                        onUploadProgress: progressEvent => {
                            let percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                            console.log("percent completed:")
                            console.log(percentCompleted)
                            api.dispatch(setUploadProgress(percentCompleted))
                        }
                    })
                    return { data: result.data }
                } catch (error) {
                    let err = error
                    return {
                        error: {
                            status: err.response?.status,
                            data: err.response?.data || err.message,
                        }
                    }
                } finally {
                    api.dispatch(setUploadProgress(0))
                }
            },
            
        }),
        getUserPhotos: builder.query({
            query: username => `vault/${username}`
        }),
        deleteUserPhotos: builder.mutation({
            query: ({ username, photoIds }) => ({
                url: `vault/${username}/delete`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(photoIds)
            }),
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
    useUploadPhotoMutation,
    useDeleteUserPhotosMutation,
    useDeleteUserMutation
} = api;

export default api;