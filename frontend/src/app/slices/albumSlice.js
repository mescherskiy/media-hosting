import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    albums: [],
}

const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {
        setAlbums: (state, action) => {
            state.albums = action.payload
        }
    }
})

export const { setAlbums } = albumSlice.actions
export default albumSlice.reducer

export const selectAlbums = (state) => state.album.albums