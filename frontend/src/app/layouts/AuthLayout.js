import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectAuth, selectCurrentUser } from '../slices/authSlice';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../api/api';

const AuthLayout = () => {
    // const user = useGetUserQuery().data
    const isAuthenticated = useSelector(selectAuth)
    const navigate = useNavigate()

    useEffect(() => {
        console.log(isAuthenticated)
        if (!isAuthenticated) {
            navigate("/", {replace: true}) 
        }
    }, [isAuthenticated, navigate])


    return (
        <Outlet />
    )
}

export default AuthLayout
