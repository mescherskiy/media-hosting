import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { selectSelectedPhotos, setIndex, setIsOpen, setSelectedPhotos } from "../slices/photoSlice";
import { useCallback, useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Paginator from "./Paginator";
import { useDeleteAlbumMutation, useGetAlbumPhotosQuery } from "../api/api";
import { Spinner } from "react-bootstrap";
import { setGreenNotification, setNotificationMessage, showNotification } from "../slices/authSlice";


const Album = () => {

    const { albumId } = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { data: album, isSuccess } = useGetAlbumPhotosQuery(albumId)
    const [deleteAlbum, { isLoading: isDeleting }] = useDeleteAlbumMutation()

    const [activePage, setActivePage] = useState(parseInt(new URLSearchParams(location.search).get("p")) || 1)
    const itemsPerPage = 12
    const lastPhotoIndex = activePage * itemsPerPage
    const firstPhotoIndex = lastPhotoIndex - itemsPerPage

    const selectedPhotos = useSelector(selectSelectedPhotos)

    const handlePhotoClick = (data) => {
        dispatch(setIsOpen(true))
        if (data) {
            console.log("handlePhotoClick data: ", data)
            dispatch(setIndex(data.index))
            navigate(`./photo/${data.photo.id}?p=${activePage}`)
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

    const handleDeleteAlbum = async () => {
        try {
            const response = await deleteAlbum(albumId)
            navigate("/albums")
            dispatch(setNotificationMessage(response.message || response?.data.message))
            dispatch(setGreenNotification(true))
            dispatch(showNotification(true))
        } catch (error) {
            console.log("Error deleting album: ", error)
            dispatch(setNotificationMessage(error || error.data?.message))
            dispatch(showNotification(true))
        }

    }

    // if (isLoading) return <div>Loading...</div>

    if (isSuccess) {
        const currentPhotos = album.photos.map((photo) => ({
            ...photo,
            isSelected: selectedPhotos.includes(photo.id)
        })).slice(firstPhotoIndex, lastPhotoIndex)

        return (
            <motion.div className="container-fluid album-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="album-overlay" role="button" onClick={handleDeleteAlbum}>
                    {isDeleting ? (
                        <Spinner animation="border" role="status" className="album-spinner" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    )}
                </div>

                <h1 className="text-center">{album.name}</h1>
                <p className="text-center">{album.photos.length} elements</p>
                <div className="photogallery">
                    <PhotoAlbum
                        layout="rows"
                        photos={currentPhotos}
                        onClick={handlePhotoClick}
                        spacing={8}
                        targetRowHeight={400}
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
                    <Paginator totalNumberOfPhotos={album.photos.length} itemsPerPage={itemsPerPage} activePage={activePage} setActivePage={setActivePage} />
                </div>
                <Outlet context={[currentPhotos]} />
            </motion.div>
        );
    }


};

export default Album;