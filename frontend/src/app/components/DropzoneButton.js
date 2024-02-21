import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { setNotificationMessage, showNotification } from "../slices/authSlice";

const DropzoneButton = ({ uploadPhoto }) => {

  const dispatch = useDispatch()

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
    }
  }, [uploadPhoto, dispatch])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true, accept: { "image/*": ['.jpeg', '.png', '.gif'] }, maxSize: 1024 * 1024 * 20 });

  return (
    <div className="dropzone-button" {...getRootProps()}>
      <input {...getInputProps()} className="dropzone-btn" />
      <div className="iconDiv nav-item" tooltip="Upload" tabIndex="0">
        <div className="iconSVG">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default DropzoneButton;
