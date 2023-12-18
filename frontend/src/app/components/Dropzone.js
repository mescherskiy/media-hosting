import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { selectUploadProgress } from "../slices/uploadSlice";
import { useCallback, useState } from "react";
import { useGetUserPhotosQuery, useUploadPhotoMutation } from "../api/api";

const Dropzone = ({ username }) => {

    const uploadProgress = useSelector(selectUploadProgress)

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const { refetch } = useGetUserPhotosQuery(username)

    const [uploadPhoto] = useUploadPhotoMutation()

    const onDrop = useCallback(async (acceptedFiles) => {
        setIsUploading(true)
        setUploadError(null)

        try {
            const uploadPromises = acceptedFiles.map(async (file) => {
                const formData = new FormData()
                formData.append("file", file)

                const response = await uploadPhoto({ username, file: formData })

                if (response.error) {
                    throw new Error(response.error.message || "Upload failed")
                }

                return response
            })

            await Promise.all(uploadPromises)
            refetch()
        } catch (error) {
            setUploadError(error.message)
        } finally {
            setIsUploading(false)
        }
    }, [uploadPhoto, username, refetch])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, multiple: true, accept: { "image/*": ['.jpeg', '.png', '.gif'] }, disabled: isUploading
    });

    return (
        <>
            <div className={`dropzone ${isUploading ? "disabled" : ""}`} {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ?
                    <p>Drop the image here ...</p> :
                    <p>Drag 'n' drop image, or click to select file(s)</p>}
                {isUploading && (
                    <div className="progress progress-bar" style={{ width: `${uploadProgress}%` }}>{uploadProgress.toFixed(2)}%</div>
                )}
            </div>
            {uploadError && (
                <div className="alert alert-danger" role="alert">Error: {uploadError}</div>
            )}
        </>
    );
}

export default Dropzone
