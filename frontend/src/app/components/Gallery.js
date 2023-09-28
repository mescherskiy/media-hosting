import React from "react"
import { useGetUserPhotosQuery } from "../api/api"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../slices/authSlice"
import { Routes, Route } from "react-router-dom";

const List = ({ match, history }) => {
    const username = useSelector(selectCurrentUser).email
    const { data: userPhotos, refetch, isLoading } = useGetUserPhotosQuery(username)

    return (
        <ul className="photo-list">
            { userPhotos.map(photoId => (
                <PhotoCard 
                    key={photoId}
                    isSelected={match.params.id === photoId}
                    history={history}
                    user={username}
                    id={photoId}
                />
            )) }
        </ul>
    )
}

export const Gallery = () => {
    <Routes>
        <Route path="/:id" element={List} />
    </Routes>
}