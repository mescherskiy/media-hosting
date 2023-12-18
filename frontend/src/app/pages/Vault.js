// import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slices/authSlice";
// import { useUploadPhotoMutation, useGetUserPhotosQuery } from "../api/api";
// import { selectUploadProgress } from "../slices/uploadSlice";
import Dropzone from "../components/Dropzone";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";

import { useDeleteUserPhotosMutation } from "../api/api";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
// import Photo from "../components/Photo";
// import GooglePhoto from "react-google-photo";
import PhotoGallery from "../components/PhotoGallery";

const Vault = () => {
    const user = useSelector(selectCurrentUser)
    const username = user.email

    // const navigate = useNavigate()
    const [deletePhotos] = useDeleteUserPhotosMutation();

    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const [open, setOpen] = useState(false)
    // const [index, setIndex] = useState(0)
    
    // const photosList = useLoaderData();
    // const photos = photosList.map((photo) => ({
    //     src: `${photo.url}?size=full`,
    //     width: photo.width || 0,
    //     height: photo.height || 0,
    //     id: photo.id,
    //     isSelected: selectedPhotos.includes(photo.id)
    // }));

    // let photos = []

    // useEffect(() => {
    //     try {
    //         console.log("photoList & photos: ", photosList, photos)
    //         photos = photosList.map((photo) => ({
    //             src: `${photo.url}?size=full`,
    //             width: photo.width,
    //             height: photo.height,
    //             id: photo.id,
    //             isSelected: selectedPhotos.includes(photo.id)
    //         }))
    //     } catch (e) {
    //         console.log(e, photosList)
    //     }
    // }, [photosList])

    useEffect(() => {
        if (selectedPhotos.length > 0) {
            setIsSidebarOpen(true)
        } else {
            setIsSidebarOpen(false)
        }
    }, [selectedPhotos])

    // const handleToggleSelection = (id) => {
    //     if (selectedPhotos.includes(id)) {
    //         setSelectedPhotos((prevSelectedPhotos) =>
    //             prevSelectedPhotos.filter((photoId) => photoId !== id));
    //     } else {
    //         setSelectedPhotos((prevSelectedPhotos) => [...prevSelectedPhotos, id]);
    //     }
    // }

    const handleDeletePhotos = async ({ username, selectedPhotos }) => {
        await deletePhotos({ username, photoIds: selectedPhotos })
        setSelectedPhotos([])
    }

    // const handlePhotoClick = (data) => {
    //     setOpen(true)
    //     if (data) {
    //         console.log(data)
    //         setIndex(data.index)
    //         navigate(`photo/${data.photo.id}`)
    //     }
    // }

    // const handleChangeIndex = (newIndex) => {
    //     setIndex(newIndex)
    // }

    // useEffect(() => {
    //     console.log("Updated index: " + index);
    // }, [index]);

    // const handleClose = () => {
    //     setOpen(false)
    //     navigate("")
    // }

    return (
        <div className="container">
            <Dropzone username={username} />
            {isSidebarOpen &&
                <Sidebar selectedPhotos={selectedPhotos} handleDeletePhotos={() => handleDeletePhotos({ username, selectedPhotos })} />}
            {/* <Outlet context={[photos, open, setOpen, index, setIndex, selectedPhotos, setSelectedPhotos, handleChangeIndex, handleClose]}
            // photos={photosList}
            // open={open}
            // index={index}
            // handleToggleSelection={handleToggleSelection}
            // handleChangeIndex={handleChangeIndex}
            // handleClose={handleClose}
            // handlePhotoClick={handlePhotoClick}
            /> */}
            {/* <GooglePhoto
                open={open}
                src={photos}
                //   onChangeIndex={handleChangeIndex}
                onClose={handleClose}
            /> */}
            <PhotoGallery selectedPhotos={selectedPhotos} setSelectedPhotos={setSelectedPhotos} />
        </div>
    )
}

export default Vault