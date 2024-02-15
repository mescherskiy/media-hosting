import Dropzone from "../components/Dropzone";
import { useDeleteUserPhotosMutation, useGetUserPhotosQuery, useSharePhotosMutation } from "../api/api";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { selectPhotos, selectSelectedPhotos, setPhotos, setSelectedPhotos } from "../slices/photoSlice";
import { Outlet } from "react-router-dom";
import { Button, Container, Modal } from "react-bootstrap"
import { isEqual } from "lodash"

const Vault = () => {
    const { data: photos, isSuccess } = useGetUserPhotosQuery();
    const [deletePhotos, { isLoading: isDeleting }] = useDeleteUserPhotosMutation();
    const [sharePhotos, { isLoading: isSharing }] = useSharePhotosMutation();

    const dispatch = useDispatch()

    const selectedPhotos = useSelector(selectSelectedPhotos)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [generatedKey, setGeneratedKey] = useState(null)
    const [copied, setCopied] = useState(false)
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

    const handleSharePhotos = useCallback(
        async ({ selectedPhotos }) => {
            try {
                const res = await sharePhotos({ photoIds: selectedPhotos })
                if (res?.data) {
                    const key = `${window.location.protocol}//${window.location.host}/share/${res.data.message}`
                    // console.log("shared link: ", key)
                    setGeneratedKey(key)
                }
            } catch (error) {
                console.log("Error: ", error.message)
            }

        }, [sharePhotos]
    )

    const handleCloseModal = () => setGeneratedKey(null)

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedKey)
            .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })
            .catch(error => console.error("Failed to copy: ", error))
    }

    return (
        <Container>
            <Dropzone />
            {isSidebarOpen &&
                <Sidebar
                    selectedPhotos={selectedPhotos}
                    handleDeletePhotos={() => handleDeletePhotos({ selectedPhotos })}
                    isDeleting={isDeleting}
                    handleSharePhotos={() => handleSharePhotos({ selectedPhotos })}
                    isSharing={isSharing} />}
            <Modal show={generatedKey} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Your generated URL:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>{generatedKey}</p>
                        <div className="d-flex justify-content-end align-items-baseline">
                            {copied && <span className="px-3">Copied to clipboard</span>}
                            <Button onClick={handleCopy}>Copy</Button>
                        </div>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer> */}
            </Modal>
            <Outlet />
        </Container>
    )
}

export default Vault