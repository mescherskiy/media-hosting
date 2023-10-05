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
    const { data: userPhotos, isFetching, isLoading } = useGetUserPhotosQuery(username);

    const [selectedPhotos, setSelectedPhotos] = useState([]);

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

    const handleToggleSelection = (index) => {
        if (selectedPhotos.includes(index)) {
            setSelectedPhotos((prevSelectedPhotos) =>
                prevSelectedPhotos.filter((photoIndex) => photoIndex !== index));
        } else {
            setSelectedPhotos((prevSelectedPhotos) => [...prevSelectedPhotos, index]);
        }
    }

    if (isFetching || isLoading) { return <div>Loading...</div> }

    if (!userPhotos || userPhotos.length === 0) {
        return <div>...</div>
    }

    const photos = userPhotos.map((photo, index) => ({
        src: `${photo.url}?size=full`,
        width: photo.width,
        height: photo.height,
        isSelected: selectedPhotos.includes(index)
    }))

    return (
        <div>
            <PhotoAlbum
                layout="rows"
                photos={photos}
                onClick={handlePhotoClick}
                spacing={8}
                renderPhoto={({ photo, layout }) => (
                    <div className={`photo-item ${photo.isSelected ? "selected" : ""}`}>
                        <img
                            src={photo.src}
                            alt={`Photo ${layout.index + 1}`}
                        />
                        <div className="photo-overlay">
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="white" 
                            viewBox="0 0 24 24" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            className={`w-6 h-6 select-icon ${photo.isSelected ? "selected" : ""}`}
                            onClick={() => handleToggleSelection(layout.index)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                )}
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