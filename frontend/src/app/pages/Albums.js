import React from 'react'
import api from '../api/api'
import { store } from '../store'
import { Link, useLoaderData } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAlbums } from '../slices/albumSlice'

const Albums = () => {
    const albums = useLoaderData()
    const dispatch = useDispatch()
    
    if (albums) {
        dispatch(setAlbums(albums))
    }

    return (
        <>
            <div className="albums">
                {albums &&
                    (albums.map((album) => (
                        <Link to={`/album/${album.id}`} className="albums-item" key={album.id} >
                            <img src={album.titlePhotoSrc} />
                            <div className="album-info">
                                <h3>{album.name}</h3>
                                <p>{album.photos.length} elements</p>
                            </div>
                        </Link>
                    ))
                    )}
            </div>
        </>
    )
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