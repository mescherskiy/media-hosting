import React, { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { useLoaderData, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slices/authSlice";
import { store } from "../store";
import { PhotoAlbum } from "react-photo-album";
import "react-google-photo/styles.css"
import { cloneDeep } from "lodash";
const GooglePhoto = lazy(() => import("react-google-photo"));

const PhotoGallery = ({ selectedPhotos, setSelectedPhotos }) => {
    const user = useSelector(selectCurrentUser)
    const username = user.email

    const photosList = useLoaderData();


    

    const galleryImages = cloneDeep(photos);
    console.log("galleryImages: ", galleryImages)

    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState(0)

    // const { data: userPhotos, isFetching, isLoading, refetch } = useGetUserPhotosQuery(username);
    // const [deletePhotos] = useDeleteUserPhotosMutation();

    // const photos = useLoaderData()

    // const [selectedPhotos, setSelectedPhotos] = useState([]);
    // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate()

    // useEffect(() => {
    //     if (selectedPhotos.length > 0) {
    //         setIsSidebarOpen(true)
    //     } else {
    //         setIsSidebarOpen(false)
    //     }
    //     // setIsSidebarOpen(selectedPhotos.length > 0);
    // }, [selectedPhotos])

    // const handleDeletePhotos = useCallback(async ({ username, selectedPhotos }) => {
    //     console.log("Deleting photos for user:", username);
    //     console.log("Selected photo IDs:", selectedPhotos);
    //     await deletePhotos({ username, photoIds: selectedPhotos })
    //     setSelectedPhotos([])
    //     //refetch()
    // }, [username, selectedPhotos, deletePhotos])

    const handlePhotoClick = (data) => {
        setOpen(true)
        if (data) {
            console.log(data)
            setIndex(data.index)
            navigate(`photo/${data.photo.id}`)
        }
    }

    const handleChangeIndex = useCallback(
        (newIndex) => {
            setIndex(newIndex)
            navigate(`photo/${photos[newIndex].id}`);
        }, [navigate]);

    useEffect(() => {
        console.log("Updated index: " + index);
    }, [index]);

    const handleClose = () => {
        setOpen(false)
        navigate("")
    }

    const handleToggleSelection = useCallback((id) => {
        if (selectedPhotos.includes(id)) {
            setSelectedPhotos((prevSelectedPhotos) =>
                prevSelectedPhotos.filter((photoId) => photoId !== id));
        } else {
            setSelectedPhotos((prevSelectedPhotos) => [...prevSelectedPhotos, id]);
        }
    }, [selectedPhotos, setSelectedPhotos])

    if (!photosList || photosList.length < 1) {
        return null
    }

    const photos = photosList.map((photo) => ({
        src: `${photo.url}?size=full`,
        width: photo.width || 0,
        height: photo.height || 0,
        id: photo.id,
        isSelected: selectedPhotos.includes(photo.id)
    }));

    //if (isFetching || isLoading) { return <div>Loading...</div> }


    // return (
    //     <div>
    //         {/* {selectedPhotos && 
    //         <button onClick={() => handleDeletePhotos({username, selectedPhotos})}>
    //             Delete photos: {selectedPhotos.length}
    //             </button>} */}
    //         {isSidebarOpen &&
    //             <Sidebar selectedPhotos={selectedPhotos} handleDeletePhotos={() => handleDeletePhotos({ username, selectedPhotos })} />}
    //         <Album photos={photos} handlePhotoClick={handlePhotoClick} handleToggleSelection={handleToggleSelection} />
    //         {/* <Routes> */}
    //         {/* <Route path="" element={<Album photos={photos} handlePhotoClick={handlePhotoClick} handleToggleSelection={handleToggleSelection}/>} /> */}
    //         {/* <PhotoAlbum
    //                     layout="rows"
    //                     photos={photos}
    //                     onClick={handlePhotoClick}
    //                     spacing={8}
    //                     renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
    //                         <div className="photo-item" style={{ position: "relative", ...wrapperStyle }}>
    //                             {renderDefaultPhoto({ wrapped: true })}
    //                             <div className={`photo-overlay ${photo.isSelected ? "selected" : ""}`}>
    //                                 <svg
    //                                     xmlns="http://www.w3.org/2000/svg"
    //                                     fill="white"
    //                                     viewBox="0 0 24 24"
    //                                     strokeWidth="1"
    //                                     stroke="none"
    //                                     className={`w-6 h-6 select-icon ${photo.isSelected ? "selected" : ""}`}
    //                                     onClick={() => handleToggleSelection(photo.id)}>
    //                                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    //                                 </svg>
    //                             </div>
    //                         </div>
    //                     )}
    //                 /> */}
    //         {/* <Route path="photo/:photoId" element={<Photo photos={photos} index={index} handleChangeIndex={handleChangeIndex} handleClose={handleClose}/>} /> */}
    //         {/* <GooglePhoto
    //                     open={open}
    //                     src={photos}
    //                     srcIndex={index}
    //                     onChangeIndex={handleChangeIndex}
    //                     onClose={handleClose}
    //                 />
    //             </Route> */}
    //         {/* </Routes> */}

    //     </div>
    // );

    return (
        <div className="photogallery">
            {/* {isSidebarOpen &&
                <Sidebar selectedPhotos={selectedPhotos} handleDeletePhotos={() => handleDeletePhotos({ username, selectedPhotos })} />}
            <Album photos={photos} handlePhotoClick={handlePhotoClick} handleToggleSelection={handleToggleSelection} /> */}
            <PhotoAlbum
                layout="rows"
                photos={galleryImages}
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
            <Suspense fallback={<div>Loading...</div>}>
                <GooglePhoto
                    open={open}
                    src={photos}
                    srcIndex={index}
                    onChangeIndex={handleChangeIndex}
                    onClose={handleClose}
                />
            </Suspense>
        </div>
    );
}

export default PhotoGallery

export const photoGalleryLoader = async () => {

    const username = store.getState().auth?.user?.email

    const res = await fetch(`/api/vault/${username}`)
    if (!res.ok) {
        return Error("Could not fetch the photos")
    }
    return res.json()
}