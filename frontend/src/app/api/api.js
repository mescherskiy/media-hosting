import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { logOut, setNotificationMessage, showNotification } from "../slices/authSlice";
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

    const error = response?.error
    if (error) {
        console.log("Error in api: ", response)
        if (error.status === 403) {
            localStorage.setItem("lastVisitedPath", window.location.pathname)
            const refreshResponse = await baseQuery("auth/refreshtoken", api, extraOptions);
            if (refreshResponse?.data) {
                response = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logOut());
                api.dispatch(setNotificationMessage(refreshResponse.error.data.message))
                api.dispatch(showNotification(true))
            }
        } else if (error.status === 404) {
            window.location.href = "/*"
        } else if (error.status === 418) {
            return response
        } else {
            api.dispatch(setNotificationMessage(error?.data?.message || error?.data || ""))
            api.dispatch(showNotification(true))
            api.dispatch(logOut());
            // return response
            // window.location.href = "/error"
        }
    }

    console.log("Response in api: ", response)

    // else if (response?.error?.status === 401) {
    //     console.log(response)
    //     console.log("Status 401! Logging out")
    //     api.dispatch(logOut())
    // }
    return response;
}

const api = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Photo", "Album"],
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
            invalidatesTags: ["User"]
        }),
        logout: builder.mutation({
            query: () => ({
                url: "auth/signout",
                method: "POST",
            }),
            onQueryStarted: (_, { dispatch }) => {
                dispatch(logOut())
            },
            invalidatesTags: ["User"]
        }),
        getUser: builder.query({
            query: () => ("user"),
            providesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: () => ({
                url: `user/delete`,
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),
        editUser: builder.mutation({
            query: credentials => ({
                url: "user/edit",
                method: "PUT",
                body: { ...credentials }
            }),
            invalidatesTags: ["User"]
        }),
        getUserPhotos: builder.query({
            query: () => `vault`,
            providesTags: ["Photo"],
        }),
        getPhotoById: builder.query({
            query: (photoId) => (`vault/${photoId}`)
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
            queryFn: async ({ file }, api) => {
                try {
                    const result = await axios.post(`/api/vault/upload`, file, {
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
            invalidatesTags: ["Photo"],
        }),
        deleteUserPhotos: builder.mutation({
            query: ({ photoIds }) => ({
                url: "vault/delete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(photoIds)
            }),
            invalidatesTags: ["Photo", "Album"],
        }),
        sharePhotos: builder.mutation({
            query: ({ photoIds }) => ({
                url: "share",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(photoIds)
            })
        }),
        getSharedPhotos: builder.query({
            query: (key) => ({
                url: `share/${key}`,
                method: "GET"
            })
        }),
        getAllAlbums: builder.query({
            query: () => "album",
            providesTags: ["Album"]
        }),
        createNewAlbum: builder.mutation({
            query: (albumRequest) => ({
                url: "album/new",
                method: "POST",
                body: { ...albumRequest }
            }),
            invalidatesTags: ["Album"]
        }),
        addPhotosToAlbum: builder.mutation({
            query: ({ albumId, photoIds }) => ({
                url: "album/add",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ albumId, photoIds })
            }),
            invalidatesTags: ["Album"]
        }),
        getAlbumPhotos: builder.query({
            query: (id) => (`album/${id}`),
            providesTags: ["Album"]
        }),
        deleteAlbum: builder.mutation({
            query: (albumId) => ({
                url: `album/${albumId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Album"]
        })
    })
})

export const {
    useLoginMutation,
    useRegistrationMutation,
    useLogoutMutation,
    useGetUserPhotosQuery,
    useGetPhotoByIdQuery,
    useUploadPhotoMutation,
    useDeleteUserPhotosMutation,
    useDeleteUserMutation,
    useGetUserQuery,
    useSharePhotosMutation,
    useGetSharedPhotosQuery,
    useGetAllAlbumsQuery,
    useCreateNewAlbumMutation,
    useGetAlbumPhotosQuery,
    useDeleteAlbumMutation,
    useAddPhotosToAlbumMutation,
    useEditUserMutation,
} = api;

export default api;