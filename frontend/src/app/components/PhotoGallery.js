import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slices/authSlice";
import { useGetUserPhotosQuery } from "../api/api";
import GooglePhoto from "react-google-photo";
import { PhotoAlbum } from "react-photo-album";
import "react-google-photo/styles.css"

const PhotoGallery = () => {
    const user = useSelector(selectCurrentUser)
    const username = user.email

    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState(0)
    const { data: userPhotos, isFetching, isLoading} = useGetUserPhotosQuery(username);



    const handlePhotoClick = (data) => {
        setOpen(true)
        if (data) {
            setIndex(data.index)
        }
    }

    const handleChangeIndex = (newIndex) => {
        setIndex(newIndex)
    }

    const handleClose = () => {
        setOpen(false)
    }

    if (isFetching || isLoading) { return <div>Loading...</div> }

    if (!userPhotos || userPhotos.length === 0) {
        return <div>...</div>
    }

    const photos = userPhotos.map(photo => ({
        src: `${photo.url}?size=full`,
        width: photo.width,
        height: photo.height,
    }))

    return (
        <div>
            <PhotoAlbum
                layout="rows"
                photos={photos}
                onClick={handlePhotoClick} 
                spacing={8}

                />
            <GooglePhoto
                open={open}
                src={photos}
                srcIndex={index}
                onChangeIndex={handleChangeIndex}
                onClose={handleClose}
                />
        </div>
    );
}

export default PhotoGallery