import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    const [user] = useState(useSelector(selectCurrentUser))

    useEffect(() => {
        console.log(user)
        if (!user) {
            <Navigate to="/" replace={true} />
        }
    }, [user])


    return (
        <Outlet />
    )
}

export default AuthLayout
