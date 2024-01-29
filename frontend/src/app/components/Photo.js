import React, { useCallback, useEffect } from "react";
import GooglePhoto from "react-google-photo";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectIndex, selectIsOpen, selectPhotos, setIndex, setIsOpen } from "../slices/photoSlice";
import { checkUser } from "../layouts/AuthLayout";
import { useGetUserQuery } from "../api/api";

const Photo = () => {

    const photos = useSelector(selectPhotos)
    const index = useSelector(selectIndex)
    const isOpen = useSelector(selectIsOpen)

    const getUserQuery = useGetUserQuery()

    const navigate = useNavigate()
    const dispatch = useDispatch()

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
            navigate(`../photo/${photos[newIndex].id}`);
            checkUser(getUserQuery, dispatch, navigate)
        }, [dispatch, navigate, photos, getUserQuery]
    );

    const handleClose = () => {
        dispatch(setIsOpen(false))
        navigate("/vault")
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