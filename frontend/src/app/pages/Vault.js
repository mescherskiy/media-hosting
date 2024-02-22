import Dropzone from "../components/Dropzone";
import { useDeleteUserPhotosMutation, useGetUserPhotosQuery, useSharePhotosMutation } from "../api/api";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { selectPhotos, selectSelectedPhotos, setPhotos, setSelectedPhotos } from "../slices/photoSlice";
import { Outlet} from "react-router-dom";
import { Button, Container, Modal } from "react-bootstrap"
import { isEqual } from "lodash"

const Vault = () => {
    const { data, isSuccess } = useGetUserPhotosQuery();
    const [deletePhotos, { isLoading: isDeleting }] = useDeleteUserPhotosMutation();
    const [sharePhotos, { isLoading: isSharing }] = useSharePhotosMutation();
    const selectedPhotos = useSelector(selectSelectedPhotos)

    // const photos = useLoaderData().map((photo) => ({
    //     ...photo,
    //     isSelected: selectedPhotos.includes(photo.id)
    // }))



    const dispatch = useDispatch()


    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [generatedKey, setGeneratedKey] = useState(null)
    const [copied, setCopied] = useState(false)
    const photos = useSelector(selectPhotos)

    const prevPhotosRef = useRef(photos)

    const refreshSelectedPhotos = () => {
        dispatch(setSelectedPhotos([]))
    }

    useEffect(() => {
        if (isSuccess && data) {
            const newPhotos = data?.map((photo) => ({
                ...photo,
                isSelected: selectedPhotos.includes(photo.id)
            }))

            if (!isEqual(prevPhotosRef.current, newPhotos)) {
                dispatch(setPhotos(newPhotos))
                prevPhotosRef.current = newPhotos
            }
        }

    }, [dispatch, data, selectedPhotos, isSuccess])

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
                dispatch(setSelectedPhotos([]))
                if (res?.data) {
                    const key = `${window.location.protocol}//${window.location.host}/share/${res.data.message}`
                    setGeneratedKey(key)
                }
            } catch (error) {
                console.log("Error: ", error.message)
            }

        }, [sharePhotos, dispatch]
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

    if (isSuccess) {

    //     const photos = data.map((photo) => ({
    //         ...photo,
    //         isSelected: selectedPhotos.includes(photo.id)
    //     }))

        return (
            <Container>
                <Dropzone />

                {isSidebarOpen &&
                    <Sidebar
                        selectedPhotos={selectedPhotos}
                        handleDeletePhotos={() => handleDeletePhotos({ selectedPhotos })}
                        isDeleting={isDeleting}
                        handleSharePhotos={() => handleSharePhotos({ selectedPhotos })}
                        isSharing={isSharing}
                        refreshSelectedPhotos={refreshSelectedPhotos} />}

                <Modal className="share-modal" show={generatedKey} onHide={handleCloseModal}>
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
                </Modal>

                <Outlet context={[photos]} />
            </Container>
        )
    }
}

export default Vault

// export const vaultLoader = async () => {
//     const response = store.dispatch(api.endpoints.getUserPhotos.initiate())
//     try {
//         const result = await response.unwrap()
//         return result
//     } catch (e) {
//         console.log("Error in vaultLoader: ", e)
//     } finally {
//         response.unsubscribe()
//     }
// }