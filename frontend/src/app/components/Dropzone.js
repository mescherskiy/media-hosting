import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { selectUploadProgress } from "../slices/uploadSlice";
import { useCallback, useState } from "react";
import { useGetUserPhotosQuery, useUploadPhotoMutation } from "../api/api";

const Dropzone = () => {

    const uploadProgress = useSelector(selectUploadProgress)

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const [uploadPhoto] = useUploadPhotoMutation()

    const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
        setIsUploading(true)
        setUploadError(null)
        console.log(acceptedFiles)
        console.log(rejectedFiles)

        if (rejectedFiles.length > 0) {
            setUploadError(rejectedFiles[0].errors[0].message)
        }

        try {
            const uploadPromises = acceptedFiles.map(async (file) => {
                const formData = new FormData()
                formData.append("file", file)
                console.log(file)
                console.log(file.type)


                if (!file.type.startsWith("image/")) {
                    throw new Error("Unsupported file format. Please upload only image files.")
                }

                const response = await uploadPhoto({ file: formData })

                if (response.error) {
                    throw new Error(response.error.message || "Upload failed")
                }

                return response
            })

            await Promise.all(uploadPromises)
        } catch (error) {
            setUploadError(error.message)
            console.log(error.message)
        } finally {
            console.log(uploadError)
            setIsUploading(false)
        }
    }, [uploadPhoto])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, multiple: true, accept: { "image/*": ['.jpeg', '.png', '.gif'] }, disabled: isUploading
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
