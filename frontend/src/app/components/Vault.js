import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slices/authSlice";
import { useUploadPhotoMutation, useGetUserPhotosQuery } from "../api/api";
import PhotoGallery from "./PhotoGallery";

const Vault = () => {
    const user = useSelector(selectCurrentUser)
    const username = user.email

    const { refetch } = useGetUserPhotosQuery(username)

    const [uploadPhoto] = useUploadPhotoMutation()

    useEffect(() => {
        refetch()
    }, [refetch])

    const refetchGetUserPhotos = useCallback(() => {
        refetch()
    }, [refetch])

    return (
        <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dropzone email={username} uploadPhoto={uploadPhoto} onPhotoUploaded={refetchGetUserPhotos} />
            <PhotoGallery />
        </motion.div>
    )
}

function Dropzone({ email, uploadPhoto, onPhotoUploaded }) {
    const onDrop = async (acceptedFiles) => {
        try {
            const uploadPromises = acceptedFiles.map(async (file) => {
                const formData = new FormData()
                formData.append("file", file)
                return uploadPhoto({ email: email, file: formData })
            })
            const uploadResults = await Promise.all(uploadPromises)
            console.log(uploadResults)
            console.log("Files uploaded succesfully")
            onPhotoUploaded()
        } catch (err) {
            console.log(err)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, accept: {"image/jpeg": []} })

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ?
                <p>Drop the image here ...</p> :
                <p>Drag 'n' drop image, or click to select file</p>}
        </div>
    )
}

export default Vault
