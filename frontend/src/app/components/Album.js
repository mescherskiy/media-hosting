import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { selectSelectedPhotos, setIndex, setIsOpen, setSelectedPhotos } from "../slices/photoSlice";
import { useCallback, useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Paginator from "./Paginator";
import { useGetAlbumPhotosQuery } from "../api/api";


const Album = () => {

    const { albumId } = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { data: album, isSuccess } = useGetAlbumPhotosQuery(albumId)

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

    // if (isLoading) return <div>Loading...</div>

    if (isSuccess) {
        const currentPhotos = album.photos.map((photo) => ({
            ...photo,
            isSelected: selectedPhotos.includes(photo.id)
        })).slice(firstPhotoIndex, lastPhotoIndex)

    return (
        <motion.div className="container-fluid album-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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