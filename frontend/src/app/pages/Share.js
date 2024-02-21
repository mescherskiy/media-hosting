import React from 'react'
import GooglePhoto from 'react-google-photo'
import { motion } from "framer-motion";
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSharedPhotosQuery } from '../api/api'

const Share = () => {
    const navigate = useNavigate()
    const { key } = useParams()
    const { data: photos, isLoading, isError, isSuccess } = useGetSharedPhotosQuery(key)

    if (isLoading) {
        return null
    }

    if (isError) {
        return <h1 className='text-center text-white p-5'>Oopsy daisy... Page not found!</h1>
    }

    if (isSuccess) {
        // const srcPhotos = photos.map(photo => {
        //     return { ...photo, src: photo.url }
        // })

        return (
            <motion.div className="container profile-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GooglePhoto
                    open={true}
                    src={photos}
                    onClose={() => navigate("/")}
                />
            </motion.div>
        )
    }



}

export default Share