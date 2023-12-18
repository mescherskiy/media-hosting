// import { PhotoAlbum } from "react-photo-album";
// import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import { useState } from "react";
// import { useDeleteUserPhotosMutation } from "../api/api";

// const Album = () => {

//     const [photos, open, setOpen, index, setIndex, selectedPhotos, setSelectedPhotos, handleChangeIndex, handleClose] = useOutletContext()

//     const navigate = useNavigate()

//     const handlePhotoClick = (data) => {
//         setOpen(true)
//         if (data) {
//             console.log(data)
//             setIndex(data.index)
//             //navigate(`photo/${data.photo.id}`)
//         }
//     }

//     const handleToggleSelection = (id) => {
//         if (selectedPhotos.includes(id)) {
//             setSelectedPhotos((prevSelectedPhotos) =>
//                 prevSelectedPhotos.filter((photoId) => photoId !== id));
//         } else {
//             setSelectedPhotos((prevSelectedPhotos) => [...prevSelectedPhotos, id]);
//         }
//     }



//     // const user = useSelector(selectCurrentUser)
//     // const username = user.email

//     // const photos = useLoaderData()

//     // const [open, setOpen] = useState(false)
//     // const [index, setIndex] = useState(0)
//     // const [selectedPhotos, setSelectedPhotos] = useState([]);
//     // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     // const [deletePhotos] = useDeleteUserPhotosMutation();

//     // useEffect(() => {
//     //     if (selectedPhotos.length > 0) {
//     //         setIsSidebarOpen(true)
//     //     } else {
//     //         setIsSidebarOpen(false)
//     //     }
//     // }, [selectedPhotos])

//     // const handleDeletePhotos = useCallback(async ({ username, selectedPhotos }) => {
//     //     console.log("Deleting photos for user:", username);
//     //     console.log("Selected photo IDs:", selectedPhotos);
//     //     await deletePhotos({ username, photoIds: selectedPhotos })
//     //     setSelectedPhotos([])
//     //     //refetch()
//     // }, [username, selectedPhotos, deletePhotos])

//     // const handlePhotoClick = (data) => {
//     //     setOpen(true)
//     //     if (data) {
//     //         console.log(data)
//     //         setIndex(data.index)
//     //         navigate(`photo/${data.photo.id}`)
//     //     }
//     // }

//     // const handleChangeIndex = (newIndex) => {
//     //     setIndex(newIndex)
//     // }

//     // useEffect(() => {
//     //     console.log("Updated index: " + index);
//     // }, [index]);

//     // const handleClose = () => {
//     //     setOpen(false)
//     //     navigate("")
//     // }

//     // const handleToggleSelection = useCallback((id) => {
//     //     if (selectedPhotos.includes(id)) {
//     //         setSelectedPhotos((prevSelectedPhotos) =>
//     //             prevSelectedPhotos.filter((photoId) => photoId !== id));
//     //     } else {
//     //         setSelectedPhotos((prevSelectedPhotos) => [...prevSelectedPhotos, id]);
//     //     }
//     // }, [selectedPhotos, setSelectedPhotos])

//     return (
//         <>
//             {/* {isSidebarOpen &&
//                 <Sidebar selectedPhotos={selectedPhotos} handleDeletePhotos={() => handleDeletePhotos({ username, selectedPhotos })} />} */}
//             {photos && photos.length > 0 && (
//                 <PhotoAlbum
//                     layout="rows"
//                     photos={photos}
//                     onClick={handlePhotoClick}
//                     spacing={8}
//                     renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
//                         <div
//                             className="photo-item"
//                             style={{ position: "relative", ...wrapperStyle }}
//                         >
//                             {renderDefaultPhoto({ wrapped: true })}
//                             <div className={`photo-overlay ${photo.isSelected ? "selected" : ""}`}>
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="white"
//                                     viewBox="0 0 24 24"
//                                     strokeWidth="1"
//                                     stroke="none"
//                                     className={`w-6 h-6 select-icon ${photo.isSelected ? "selected" : ""}`}
//                                     onClick={() => handleToggleSelection(photo.id)}
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                     />
//                                 </svg>
//                             </div>
//                         </div>
//                     )}
//                 />
//             )}


//         </>
//     );
// };

// export default Album;

// // export const albumLoader = async () => {

// //     const username = store.getState().auth.user?.email

// //     const res = await fetch(`/api/vault/${username}`)
// //     if (!res.ok) {
// //         return Error("Could not fetch the photos")
// //     }
// //     return res.json().map((photo) => ({
// //         src: `${photo.url}?size=full`,
// //         width: photo.width,
// //         height: photo.height,
// //         id: photo.id,
// //         isSelected: selectedPhotos.includes(photo.id)
// //     }))
// // }

// // if (photos && photos.length > 0) {
// //     mappedPhotos = photos.map((photo) => ({
// //         src: `${photo.url}?size=full`,
// //         width: photo.width,
// //         height: photo.height,
// //         id: photo.id,
// //         isSelected: selectedPhotos.includes(photo.id)
// //     }))
// // } 