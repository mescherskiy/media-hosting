import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    photos: [],
    index: 0,
    selectedPhotos: [],
    isOpen: true,
}

const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {
        setPhotos: (state, action) => {
            state.photos = action.payload
        },
        setIndex: (state, action) => {
            state.index = action.payload
        },
        setSelectedPhotos: (state, action) => {
            state.selectedPhotos = action.payload
        },
        setIsOpen: (state, action) => {
            state.isOpen = action.payload
        },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(api.endpoints.getUserPhotos.matchFulfilled, (state, action) => {
    //             console.log(action)
    //             console.log(action.payload)
    //             const photos = Array.isArray(action.payload)
    //             ? action.payload.map((photo) => ({
    //                 src: photo.url,
    //                 width: photo.width || 0,
    //                 height: photo.height || 0,
    //                 id: photo.id,
    //                 isSelected: state.selectedPhotos.includes(photo.id),
    //             }))
    //             : []

    //             state.photos = photos
    //         })
    // }
})

export const { setPhotos, setIndex, setSelectedPhotos, setIsOpen } = photoSlice.actions
export default photoSlice.reducer

export const selectPhotos = (state) => state.photo.photos
export const selectIndex = (state) => state.photo.index
export const selectSelectedPhotos = (state) => state.photo.selectedPhotos
export const selectIsOpen = (state) => state.photo.isOpen