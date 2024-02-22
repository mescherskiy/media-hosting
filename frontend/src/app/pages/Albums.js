import React, { useEffect } from 'react'
import api from '../api/api'
import { store } from '../store'
import { Link, useLoaderData } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAlbums } from '../slices/albumSlice'

const Albums = () => {
    const albums = useLoaderData()
    const filteredAlbums = albums.filter(album => album.photos.length > 0)
    const dispatch = useDispatch()

    useEffect(() => {
        if (filteredAlbums.length > 0) {
            dispatch(setAlbums(filteredAlbums))
        }
    }, [dispatch, filteredAlbums])


    return (
        <>
            <div className="albums">
                {filteredAlbums?.length > 0 ?
                    (filteredAlbums.map((album) => (
                        <Link to={`/album/${album.id}`} className="albums-item" key={album.id} >
                            <img src={album.titlePhotoSrc} alt={album.name} />
                            <div className="album-info">
                                <h3>{album.name}</h3>
                                <p>{album.photos.length} elements</p>
                            </div>
                        </Link>
                    ))
                    ) : (<h4 className="m-5 text-center text-white">You have no albums yet</h4>)}
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