import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
    name: "upload",
    initialState: { uploadProgress: 0, uploadError: null },
    reducers: {
        setUploadProgress: (state, action) => {
            return {
                ...state,
                uploadProgress: action.payload
            }
        },
        setUploadError: (state, action) => {
            return {
                ...state,
                uploadError: action.payload
            }
        }
    }
})

export const { setUploadProgress, setUploadError } = uploadSlice.actions
export default uploadSlice.reducer

export const selectUploadProgress = (state) => state.upload.uploadProgress
export const selectUploadError = (state) => state.upload.uploadError