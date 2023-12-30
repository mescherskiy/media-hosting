import Dropzone from "../components/Dropzone";
import { useDeleteUserPhotosMutation, useGetUserPhotosQuery } from "../api/api";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PhotoGallery from "../components/PhotoGallery";

const Vault = () => {
    const { data: photoList, isError, error, isLoading, isSuccess } = useGetUserPhotosQuery();
    const [deletePhotos] = useDeleteUserPhotosMutation();

    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (selectedPhotos.length > 0) {
            setIsSidebarOpen(true)
        } else {
            setIsSidebarOpen(false)
        }
    }, [selectedPhotos])

    const handleDeletePhotos = async ({ selectedPhotos }) => {
        await deletePhotos({ photoIds: selectedPhotos })
        setSelectedPhotos([])
    }

    let content = null

    if (isLoading) {
        content = <div>Loading...</div>
    } else if (isError) {
        content = <div>{error.message}</div>
    } else if (isSuccess && photoList) {
        console.log("photos in Vault: ", photoList)
        const photos = photoList.map((photo) => ({
            src: `${photo.url}?size=full`,
            width: photo.width || 0,
            height: photo.height || 0,
            id: photo.id,
            isSelected: selectedPhotos.includes(photo.id)
        }));
        content = <PhotoGallery selectedPhotos={selectedPhotos} setSelectedPhotos={setSelectedPhotos} photos={photos}/>
    }

    return (
        <div className="container">
            <Dropzone />
            {isSidebarOpen &&
                <Sidebar selectedPhotos={selectedPhotos} handleDeletePhotos={() => handleDeletePhotos({ selectedPhotos })} />}
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
            {/* <PhotoGallery selectedPhotos={selectedPhotos} setSelectedPhotos={setSelectedPhotos} photosList={photos}/> */}
            {content}
        </div>
    )
}

export default Vault