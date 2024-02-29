import { useCallback, useEffect, useState } from "react";
import { Button, FormControl, InputGroup, ListGroup, Modal, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { useAddPhotosToAlbumMutation, useCreateNewAlbumMutation, useDeleteUserPhotosMutation, useGetAllAlbumsQuery, useSharePhotosMutation } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { setGreenNotification, setNotificationMessage, showNotification } from "../slices/authSlice";
import { selectSelectedPhotos, setSelectedPhotos } from "../slices/photoSlice";

const Sidebar = () => {

  const [deletePhotos, { isLoading: isDeleting }] = useDeleteUserPhotosMutation()
  const [sharePhotos, { isLoading: isSharing }] = useSharePhotosMutation()
  const [createAlbum] = useCreateNewAlbumMutation()
  const { data: albums, isSuccess } = useGetAllAlbumsQuery()
  const [addToAlbum] = useAddPhotosToAlbumMutation()

  const selectedPhotos = useSelector(selectSelectedPhotos)

  const dispatch = useDispatch()

  const [showAlbumModal, setShowAlbumModal] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [generatedKey, setGeneratedKey] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (selectedPhotos.length > 0) {
      setIsSidebarOpen(true)
    } else {
      setIsSidebarOpen(false)
    }
  }, [selectedPhotos])

  const refreshSelectedPhotos = useCallback (() => {
    dispatch(setSelectedPhotos([]))
  }, [dispatch])

  const showResponseMessageToUser = (response) => {
    dispatch(setNotificationMessage(response.message || response?.data.message))
    dispatch(setGreenNotification(true))
    dispatch(showNotification(true))
  }

  const showErrorToUser = (error) => {
    dispatch(setNotificationMessage(error?.message || error?.data?.message))
    dispatch(showNotification(true))
  }

  const handleCloseAlbumModal = () => {
    setShowAlbumModal(false)
    setNewAlbumName("")
  }

  const handleSharePhotos = useCallback(
    async (selectedPhotos) => {
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

  const handleCreateAlbum = async (albumName, photos) => {
    try {
      const res = await createAlbum({ name: albumName, photoIds: photos })
      handleCloseAlbumModal()
      refreshSelectedPhotos()
      showResponseMessageToUser(res)
    } catch (error) {
      showErrorToUser(error)
    }
  }

  const handleAddToAlbum = async (albumId, photos) => {
    try {
      const res = await addToAlbum({ albumId, photoIds: photos })
      handleCloseAlbumModal()
      refreshSelectedPhotos()
      showResponseMessageToUser(res)
    } catch (error) {
      showErrorToUser(error)
    }
  }

  const handleDeletePhotos = useCallback(
    async (selectedPhotos) => {
      await deletePhotos({ photoIds: selectedPhotos })
      refreshSelectedPhotos()
    }, [deletePhotos, refreshSelectedPhotos])

  const handleCloseShareModal = () => setGeneratedKey(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(error => console.error("Failed to copy: ", error))
  }

  return (
    <>
      {isSidebarOpen &&
        <div className={`sidebar-container ${selectedPhotos.length > 0 ? "open" : ""}`}>
          <div className="sidebar-wrapper">
            <ul className="sidebar-list">
              <li className="sidebar-listItem">
                <OverlayTrigger placement="left" overlay={<Tooltip>Share</Tooltip>}>
                  <Button onClick={() => handleSharePhotos(selectedPhotos)}>
                    {isSharing ? (
                      <Spinner animation="border" role="status" className="sidebar-listIcon" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6 sidebar-listIcon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                      </>
                    )}
                  </Button>
                </OverlayTrigger>
              </li>
              <li className="sidebar-listItem">
                <OverlayTrigger placement="left" overlay={<Tooltip>Add to album</Tooltip>}>
                  <Button onClick={() => setShowAlbumModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6 sidebar-listIcon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </Button>
                </OverlayTrigger>
              </li>
              <li className="sidebar-listItem">
                <OverlayTrigger placement="left" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button onClick={() => handleDeletePhotos(selectedPhotos)}>
                    {isDeleting ? (
                      <Spinner animation="border" role="status" className="sidebar-listIcon" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6 sidebar-listIcon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </>
                    )}
                  </Button>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
        </div>
      }
      <Modal className="add-to-album-modal" show={showAlbumModal} onHide={handleCloseAlbumModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add to:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="create-new-album-input p-0">
            <FormControl
              placeholder=" + New album"
              value={newAlbumName}
              onChange={e => setNewAlbumName(e.target.value)}
            />
            <Button disabled={!newAlbumName} onClick={() => handleCreateAlbum(newAlbumName, selectedPhotos)} variant="primary">Create</Button>
          </InputGroup>
          <hr />
          <ListGroup>
            {isSuccess &&
              (albums.map((album) => (
                <ListGroup.Item action onClick={() => handleAddToAlbum(album.id, selectedPhotos)} key={album.id} className="album-li">{album.name}<span>{album.photos.length} elements</span></ListGroup.Item>
              ))
              )}
          </ListGroup>
        </Modal.Body>
      </Modal>
      <Modal className="share-modal" show={generatedKey} onHide={handleCloseShareModal}>
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
    </>
  );
};

export default Sidebar;

