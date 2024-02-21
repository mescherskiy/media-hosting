import React, { useCallback, useEffect } from "react";
import GooglePhoto from "react-google-photo";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { selectIndex, selectIsOpen, selectPhotos, setIndex, setIsOpen } from "../slices/photoSlice";
import { checkUser } from "../layouts/AuthLayout";
import { useGetUserQuery } from "../api/api";

const Photo = () => {

    const [ photos ] = useOutletContext()

    console.log("photos: ", photos)

    // const photos = useSelector(selectPhotos)
    const index = useSelector(selectIndex)
    const isOpen = useSelector(selectIsOpen)

    const getUserQuery = useGetUserQuery()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const location = useLocation()
    const activePage = new URLSearchParams(location.search).get("p") || 1

    const { photoId } = useParams()

    useEffect(() => {
        if (photos.length > 0) {
            const newIndex = photos.findIndex((photo) => String(photo.id) === photoId);
            if (newIndex !== -1) {
                dispatch(setIndex(newIndex));
            }
        }

    }, [photos, photoId, dispatch]);


    useEffect(() => {
        checkUser(getUserQuery, dispatch, navigate)
    }, [checkUser, dispatch, navigate]);

    const handleChangeIndex = useCallback(
        (newIndex) => {
            dispatch(setIndex(newIndex))
            navigate(`../photo/${photos[newIndex].id}?p=${activePage}`);
            checkUser(getUserQuery, dispatch, navigate)
        }, [dispatch, navigate, photos, getUserQuery]
    );

    const handleClose = () => {
        dispatch(setIsOpen(false))
        navigate("..")
    }

    if (!photos || photos.length === 0) {
        return <div>Loading...</div>;
      }

    return (
        <div>
            <GooglePhoto
                open={isOpen}
                src={photos}
                srcIndex={index}
                onChangeIndex={handleChangeIndex}
                onClose={handleClose}
            />
        </div>
    );
};

export default Photo;