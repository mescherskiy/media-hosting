import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectAuth } from '../slices/authSlice';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../api/api';
import Sidebar from '../components/Sidebar';

export const checkUser = async (getUserQuery, dispatch, navigate) => {
    try {
        const result = await getUserQuery.refetch()
        if (result?.error && result.error?.data?.error !== "Access token expired") {
            dispatch(logOut())
            navigate("/", { replace: true })
        }
    } catch (error) {
        console.error("Error while checking user: ", error)
    }
}

const AuthLayout = () => {
    const isAuthenticated = useSelector(selectAuth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const getUserQuery = useGetUserQuery()

    useEffect(() => {
        if (isAuthenticated) {
            checkUser(getUserQuery, dispatch, navigate)
        }
        else {
            navigate("/", { replace: true })
        }
        return () => { }
    }, [isAuthenticated, navigate, dispatch])


    return (
        <>
            <Sidebar />
            <Outlet />
        </>
    )
}

export default AuthLayout
