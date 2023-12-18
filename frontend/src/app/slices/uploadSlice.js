import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
    name: "upload",
    initialState: { uploadProgress: 0 },
    reducers: {
        setUploadProgress: (state, action) => {
            return {
                ...state,
                uploadProgress: action.payload
            }
        }
    }
})

export const { setUploadProgress } = uploadSlice.actions;
export default uploadSlice.reducer;

export const selectUploadProgress = (state) => state.upload.uploadProgress