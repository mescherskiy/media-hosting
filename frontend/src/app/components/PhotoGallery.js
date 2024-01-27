import React, { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom"
import { PhotoAlbum } from "react-photo-album";
import "react-google-photo/styles.css"
import { cloneDeep } from "lodash";
const GooglePhoto = lazy(() => import("react-google-photo"));

const PhotoGallery = ({ selectedPhotos, setSelectedPhotos, photos }) => {

    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState(0)

    const navigate = useNavigate()

    const handlePhotoClick = (data) => {
        setOpen(true)
        if (data) {
            console.log(data)
            setIndex(data.index)
            navigate(`photo/${data.photo.id}`)
        }
    }

    const handleChangeIndex = useCallback(
        (newIndex) => {
            setIndex(newIndex)
            navigate(`photo/${photos[newIndex].id}`);
        }, [navigate, photos]);

    useEffect(() => {
        const photoId = location.pathname.split("/photo/")[1];
        const newIndex = photos.findIndex((photo) => String(photo.id) === photoId);
        if (newIndex !== -1) {
            setIndex(newIndex);
        }
    }, [location.pathname, photos]);

    useEffect(() => {
        console.log("Updated index: " + index);
    }, [index, photos]);

    const handleClose = () => {
        setOpen(false)
        navigate("")
    }

    const handleToggleSelection = useCallback((id) => {
        if (selectedPhotos.includes(id)) {
            setSelectedPhotos((prevSelectedPhotos) =>
                prevSelectedPhotos.filter((photoId) => photoId !== id));
        } else {
            setSelectedPhotos((prevSelectedPhotos) => [...prevSelectedPhotos, id]);
        }
    }, [selectedPhotos, setSelectedPhotos])

    console.log("photoList in PG: ", photos)

    const galleryImages = cloneDeep(photos);
    console.log("galleryImages: ", galleryImages)

    //if (isFetching || isLoading) { return <div>Loading...</div> }


    // return (
    //     <div>
    //         {/* {selectedPhotos && 
    //         <button onClick={() => handleDeletePhotos({username, selectedPhotos})}>
    //             Delete photos: {selectedPhotos.length}
    //             </button>} */}
    //         {isSidebarOpen &&
    //             <Sidebar selectedPhotos={selectedPhotos} handleDeletePhotos={() => handleDeletePhotos({ username, selectedPhotos })} />}
    //         <Album photos={photos} handlePhotoClick={handlePhotoClick} handleToggleSelection={handleToggleSelection} />
    //         {/* <Routes> */}
    //         {/* <Route path="" element={<Album photos={photos} handlePhotoClick={handlePhotoClick} handleToggleSelection={handleToggleSelection}/>} /> */}
    //         {/* <PhotoAlbum
    //                     layout="rows"
    //                     photos={photos}
    //                     onClick={handlePhotoClick}
    //                     spacing={8}
    //                     renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
    //                         <div className="photo-item" style={{ position: "relative", ...wrapperStyle }}>
    //                             {renderDefaultPhoto({ wrapped: true })}
    //                             <div className={`photo-overlay ${photo.isSelected ? "selected" : ""}`}>
    //                                 <svg
    //                                     xmlns="http://www.w3.org/2000/svg"
    //                                     fill="white"
    //                                     viewBox="0 0 24 24"
    //                                     strokeWidth="1"
    //                                     stroke="none"
    //                                     className={`w-6 h-6 select-icon ${photo.isSelected ? "selected" : ""}`}
    //                                     onClick={() => handleToggleSelection(photo.id)}>
    //                                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    //                                 </svg>
    //                             </div>
    //                         </div>
    //                     )}
    //                 /> */}
    //         {/* <Route path="photo/:photoId" element={<Photo photos={photos} index={index} handleChangeIndex={handleChangeIndex} handleClose={handleClose}/>} /> */}
    //         {/* <GooglePhoto
    //                     open={open}
    //                     src={photos}
    //                     srcIndex={index}
    //                     onChangeIndex={handleChangeIndex}
    //                     onClose={handleClose}
    //                 />
    //             </Route> */}
    //         {/* </Routes> */}

    //     </div>
    // );

    return (
        <div className="photogallery">
            <PhotoAlbum
                layout="rows"
                photos={galleryImages}
                onClick={handlePhotoClick}
                spacing={8}
                renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
                    <div className="photo-item" style={{ position: "relative", ...wrapperStyle }}>
                        {renderDefaultPhoto({ wrapped: true })}
                        <div className={`photo-overlay ${photo.isSelected ? "selected" : ""}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                strokeWidth="1"
                                stroke="none"
                                className={`w-6 h-6 select-icon ${photo.isSelected ? "selected" : ""}`}
                                onClick={() => handleToggleSelection(photo.id)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                )}
            />
            <Suspense fallback={<div>Loading...</div>}>
                <GooglePhoto
                    open={open}
                    src={photos}
                    srcIndex={index}
                    onChangeIndex={handleChangeIndex}
                    onClose={handleClose}
                />
            </Suspense>
        </div>
    );
}

export default PhotoGallery

// export const photoGalleryLoader = (dispatch) =>
//     async ({ request }) => {
//         const promise = dispatch(api.endpoints.getUserPhotos.initiate())
//         request.signal.onabort = promise.abort;
//         const res = await promise

//         if (res.error) {
//             throw new Error('Error fetching photos');
//         }

//         const { data: photos } = res
//         console.log("photos in loader: ", photos)
//         return photos
//     }

// export const photoGalleryLoader = async (dispatch) => {
//     const promise = dispatch(api.endpoints.getUserPhotos.initiate());
//     const res = await promise;

//     if (res.error) {
//         throw new Error('Error fetching photos');
//     }

//     const { data: photos } = res;
//     console.log('photos in loader: ', photos);
//     return photos;
// };

// export const photoGalleryLoader = async () => {
//     const promise = api.endpoints.getUserPhotos.initiate()
//     const res = await promise;

//     if (res.error) {
//         throw new Error('Error fetching photos');
//     }

//     const { data: photos } = res;

//     console.log('photos in loader: ', photos);
//     return photos;
// };