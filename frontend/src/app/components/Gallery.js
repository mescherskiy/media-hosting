import React, { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { PhotoAlbum } from "react-photo-album";
import "react-google-photo/styles.css"
import { useDispatch, useSelector } from "react-redux";
import { selectPhotos, selectSelectedPhotos, setIndex, setIsOpen, setSelectedPhotos } from "../slices/photoSlice";
import Paginator from "./Paginator";

const Gallery = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const location = useLocation()

    const photos = useSelector(selectPhotos)

    const selectedPhotos = useSelector(selectSelectedPhotos)

    const [activePage, setActivePage] = useState(parseInt(new URLSearchParams(location.search).get("p")) || 1)
    const itemsPerPage = 12
    const lastPhotoIndex = activePage * itemsPerPage
    const firstPhotoIndex = lastPhotoIndex - itemsPerPage
    const currentPhotos = photos.slice(firstPhotoIndex, lastPhotoIndex)

    const handlePhotoClick = (data) => {
        dispatch(setIsOpen(true))
        if (data) {
            console.log("handlePhotoClick data: ", data)
            dispatch(setIndex(data.index))
            navigate(`photo/${data.photo.id}?p=${activePage}`)
        }
    }

    const handleToggleSelection = useCallback((id) => {
        const updatedSelectedPhotos = selectedPhotos.includes(id)
            ? selectedPhotos.filter((photoId) => photoId !== id)
            : [...selectedPhotos, id]
        dispatch(setSelectedPhotos(updatedSelectedPhotos))
        console.log("selectedPhotos: ", updatedSelectedPhotos)
    }, [selectedPhotos, dispatch])

    useEffect(() => {
        return () => {
            dispatch(setSelectedPhotos([]));
        };
    }, [dispatch]);

    if (!photos.length) {
        return <div className="text-center no-photos-text">No photos here yet...</div>
    }

    // if (isError) {
    //     return <div>{error.message}</div>;
    // }

    // if (!photos.length) {
    //     return <div>No photos available</div>;
    // }

    return (
        <div className="photogallery">
            <PhotoAlbum
                layout="rows"
                photos={currentPhotos}
                onClick={handlePhotoClick}
                spacing={8}
                renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
                    <div className="photo-item" style={{ position: "relative", ...wrapperStyle }}>
                        {renderDefaultPhoto({ wrapped: true })}
                        <div className={`photo-overlay ${photo.isSelected ? "selected" : ""}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                strokeWidth="1"
                                stroke="none"
                                className={`w-6 h-6 select-icon ${photo.isSelected ? "selected" : ""}`}
                                onClick={() => handleToggleSelection(photo.id)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                )}
            />
            <Paginator totalNumberOfPhotos={photos.length} itemsPerPage={itemsPerPage} activePage={activePage} setActivePage={setActivePage} />
        </div>
    );
}

export default Gallery