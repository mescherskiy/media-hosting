import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { selectUploadProgress } from "../slices/uploadSlice";
import { useCallback, useEffect, useState } from "react";
import { useUploadPhotoMutation } from "../api/api";
import { setNotificationMessage, showNotification } from "../slices/authSlice";

const Dropzone = () => {

    const uploadProgress = useSelector(selectUploadProgress)
    const dispatch = useDispatch()

    const [isUploading, setIsUploading] = useState(false);

    const [uploadPhoto] = useUploadPhotoMutation()

    useEffect(() => {
        if (uploadProgress > 0) {
            setIsUploading(true)
        } else {
            setIsUploading(false)
        }

        return () => {}
    }, [uploadProgress])

    const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {

        if (rejectedFiles.length > 0) {
            const err = rejectedFiles[0].errors[0].message.replace(
                /(\d+) bytes/,
                (_, size) => {
                    const maxSizeInMb = parseInt(size, 10) / (1024 * 1024)
                    return `${maxSizeInMb} Mb`
                }
            )
            dispatch(setNotificationMessage(err))
            dispatch(showNotification(true))
        }

        try {
            const uploadPromises = acceptedFiles.map(async (file) => {
                const formData = new FormData()
                formData.append("file", file)

                const response = await uploadPhoto({ file: formData })

                if (response.error) {
                    throw new Error(response.error.message || "Upload failed")
                }

                return response
            })

            await Promise.all(uploadPromises)
        } catch (error) {
            dispatch(setNotificationMessage(error.message))
            dispatch(showNotification(true))
            console.log(error.message)
        } finally {
            setIsUploading(false)
        }
    }, [uploadPhoto, dispatch])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, multiple: true, accept: { "image/*": ['.jpeg', '.png', '.gif'] }, maxSize: 1024 * 1024 * 20, disabled: isUploading
    });

    return (
        <>
            <div className={`dropzone ${isUploading ? "disabled" : ""}`} {...getRootProps()}>
                <input {...getInputProps()} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="upload-icon w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>

                {isDragActive ?
                    <p>Drop the image here ...</p> :
                    <p>Drag 'n' drop image, or click to select file(s)</p>}
                <em>Format: JPEG, PNG, GIF. Max size: 20 Mb</em>
                {isUploading && (
                    <div className="progress progress-bar" style={{ width: `${uploadProgress}%` }}>{uploadProgress.toFixed(2)}%</div>
                )}
            </div>
        </>
    );
}

export default Dropzone
