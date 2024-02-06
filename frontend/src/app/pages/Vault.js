import Dropzone from "../components/Dropzone";
import { useDeleteUserPhotosMutation, useGetUserPhotosQuery } from "../api/api";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { selectPhotos, selectSelectedPhotos, setPhotos, setSelectedPhotos } from "../slices/photoSlice";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap"
import { isEqual } from "lodash"

const Vault = () => {
    const { data: photos, isSuccess } = useGetUserPhotosQuery();
    const [deletePhotos, { isLoading: isDeleting }] = useDeleteUserPhotosMutation();

    const dispatch = useDispatch()

    const selectedPhotos = useSelector(selectSelectedPhotos)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const currentPhotos = useSelector(selectPhotos)

    const prevPhotosRef = useRef(currentPhotos)

    useEffect(() => {
        if (isSuccess && photos) {
            const newPhotos = photos?.map((photo) => ({
                src: photo.url,
                width: photo.width || 0,
                height: photo.height || 0,
                id: photo.id,
                isSelected: selectedPhotos.includes(photo.id)
            }))

            if (!isEqual(prevPhotosRef.current, newPhotos)) {
                dispatch(setPhotos(newPhotos))
                prevPhotosRef.current = newPhotos
            }
        }
    }, [dispatch, photos, isSuccess, selectedPhotos])

    useEffect(() => {
        if (selectedPhotos.length > 0) {
            setIsSidebarOpen(true)
        } else {
            setIsSidebarOpen(false)
        }
    }, [selectedPhotos])

    const handleDeletePhotos = useCallback(
        async ({ selectedPhotos }) => {
            await deletePhotos({ photoIds: selectedPhotos })
            dispatch(setSelectedPhotos([]))
        }, [deletePhotos, dispatch])

    return (
        <Container>
            <Dropzone />
            {isSidebarOpen &&
                <Sidebar selectedPhotos={selectedPhotos} handleDeletePhotos={() => handleDeletePhotos({ selectedPhotos })} isDeleting={isDeleting} />}
            <Outlet />
        </Container>
    )
}

export default Vault