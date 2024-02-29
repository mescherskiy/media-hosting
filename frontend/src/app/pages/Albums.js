import React, { useEffect } from 'react'
import api, { useGetAllAlbumsQuery } from '../api/api'
import { store } from '../store'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectAlbums, setAlbums } from '../slices/albumSlice'
import { setNotificationMessage, showNotification } from '../slices/authSlice'

const Albums = () => {
    const { data, isSuccess, isLoading, isError, error } = useGetAllAlbumsQuery()
    const dispatch = useDispatch()
    const albums = useSelector(selectAlbums)


    useEffect(() => {
        if (isSuccess && data.length > 0) {
            dispatch(setAlbums(data))
        } else if (isError) {
            dispatch(setNotificationMessage(error || error.data?.message))
            dispatch(showNotification(true))
        }
    }, [dispatch, data, isSuccess, isError, error])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isSuccess) {
        return (
            <>
                <div className="albums">
                    {albums?.length > 0 ?
                        (albums.map((album) => {
                            const titlePhoto = album.photos.find(photo => photo.width >= photo.height) || album.photos[0]
                        return (
                            <Link to={`/album/${album.id}`} className={`albums-item${album.photos.length > 0 ? "" : " empty"}`} key={album.id} >
                                {album.photos.length > 0 &&
                                    (<img src={titlePhoto.src} alt={album.name} />)}
                                <div className="album-info">
                                    <h3>{album.name}</h3>
                                    <p>{album.photos.length} elements</p>
                                </div>
                            </Link>
                        )})
                        ) : (<h4 className="m-5 text-center text-white">You have no albums yet</h4>)}
                </div>
            </>
        )
    }


}

export default Albums

export const albumsLoader = async () => {
    const response = store.dispatch(api.endpoints.getAllAlbums.initiate())
    try {
        const result = await response.unwrap()
        return result
    } catch (e) {
        console.log("Error in loader: ", e)
    } finally {
        response.unsubscribe()
    }
}