// import React, { useState } from "react";
// import GooglePhoto from "react-google-photo";
// import { useOutletContext, useParams } from "react-router-dom";

// const Photo = () => {

//     const [photos, open, setOpen, index, setIndex, selectedPhotos, setSelectedPhotos, handleChangeIndex, handleClose] = useOutletContext()

//     const { photoId } = useParams()

//     console.log("photos in Photo: ", photos)
//     console.log("index in Photo: ", index)

//     const photoIndex = photos.findIndex((photo) => photo.id == photoId)
//     console.log(photoIndex)

//     return (
//         <div className="photoooo">
//             <GooglePhoto
//                 open={open}
//                 src={photos}
//                 srcIndex={photoIndex}
//                 //   onChangeIndex={handleChangeIndex}
//                 onClose={handleClose}
//             />
//         </div>

//     );
// };

// export default Photo;