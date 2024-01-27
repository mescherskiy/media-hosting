import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom"
import { PhotoAlbum } from "react-photo-album";
import { Pagination } from "react-bootstrap";
import "react-google-photo/styles.css"
import { useDispatch, useSelector } from "react-redux";
import { selectPhotos, selectSelectedPhotos, setIndex, setIsOpen, setSelectedPhotos } from "../slices/photoSlice";

const Gallery = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const photos = useSelector(selectPhotos)

    const selectedPhotos = useSelector(selectSelectedPhotos)

    const [activePage, setActivePage] = useState(1)
    const itemsPerPage = 12

    const handlePageChange = (page) => {
        setActivePage(page)
    }

    const handlePhotoClick = (data) => {
        dispatch(setIsOpen(true))
        if (data) {
            console.log("handlePhotoClick data: ", data)
            dispatch(setIndex(data.index))
            navigate(`photo/${data.photo.id}`)
        }
    }

    const handleToggleSelection = useCallback((id) => {
        const updatedSelectedPhotos = selectedPhotos.includes(id)
            ? selectedPhotos.filter((photoId) => photoId !== id)
            : [...selectedPhotos, id]
        dispatch(setSelectedPhotos(updatedSelectedPhotos))
    }, [selectedPhotos, dispatch])

    if (!photos.length) {
        return <div>Loading...</div>
    }

    const totalPages = Math.ceil(photos.length / itemsPerPage)

    const lastPhotoIndex = activePage * itemsPerPage
    const firstPhotoIndex = lastPhotoIndex - itemsPerPage
    const currentPhotos = photos.slice(firstPhotoIndex, lastPhotoIndex)


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
            {totalPages > 1 && (
                <Pagination>
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === activePage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            )}

        </div>
    );
}

export default Gallery