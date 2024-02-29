import Dropzone from "../components/Dropzone";
import { useGetUserPhotosQuery } from "../api/api";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPhotos, selectSelectedPhotos, setPhotos } from "../slices/photoSlice";
import { Outlet} from "react-router-dom";
import { Container } from "react-bootstrap"
import { isEqual } from "lodash"

const Vault = () => {
    const { data, isSuccess } = useGetUserPhotosQuery();
    const selectedPhotos = useSelector(selectSelectedPhotos)

    const dispatch = useDispatch()

    const photos = useSelector(selectPhotos)
    const prevPhotosRef = useRef(photos)

    useEffect(() => {
        if (isSuccess && data) {
            const newPhotos = data?.map((photo) => ({
                ...photo,
                isSelected: selectedPhotos.includes(photo.id)
            }))
            if (!isEqual(prevPhotosRef.current, newPhotos)) {
                dispatch(setPhotos(newPhotos))
                prevPhotosRef.current = newPhotos
            }
        }
    }, [dispatch, data, selectedPhotos, isSuccess])


    if (isSuccess) {

        return (
            <Container>
                <Dropzone />
                <Outlet context={[photos]} />
            </Container>
        )
    }
}

export default Vault