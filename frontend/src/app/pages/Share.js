import React from 'react'
import GooglePhoto from 'react-google-photo'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSharedPhotosQuery } from '../api/api'

const Share = () => {
    const navigate = useNavigate()
    const { key } = useParams()
    const { data: photos, isLoading, isError, error, isSuccess } = useGetSharedPhotosQuery(key)

    if (isLoading) {
        return null
    }

    if (isError) {
        return <div>Oops, an error occured: {error}</div>
    }

    if (isSuccess) {
        const srcPhotos = photos.map(photo => {
            return { ...photo, src: photo.url }
        })

        return (
            <GooglePhoto
                open={true}
                src={srcPhotos}
                onClose={() => navigate("/")}
            />
        )
    }



}

export default Share