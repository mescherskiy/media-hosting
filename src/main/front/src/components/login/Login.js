import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setCredentials } from "../../features/auth/authSlice";
import { useLoginMutation } from "../../features/api/apiSlice";

import "./login.css"

const Login = () => {

    const userRef = useRef()
    const errorRef = useRef()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrorMessage("")
    }, [email, password])

    const handleUsernameChange = e => setEmail(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const userData = await login({ email, password }).unwrap()
            dispatch(setCredentials({ ...userData, email}))
            setEmail("")
            setPassword("")
            navigate("/api")
        } catch (err) {
            if (!err?.originalStatus) {
                setErrorMessage("No server response")
            } else if (err.originalStatus === 400) {
                setErrorMessage("Missing username or password")
            } else if (err.originalStatus === 401) {
                setErrorMessage("Unauthorized")
            } else {
                setErrorMessage("Login failed")
            }
            errorRef.current.focus()
        }
    }

    const content = isLoading ? <h1>Loading...</h1> : (
        <section className="login">
            <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive">{errorMessage}</p>

            <form onSubmit={handleSubmit}>

                <h2 className="text-center text-white pt-4 pb-1">Sign in</h2>

                <div className="formGroup">
                    <input type="email" placeholder="E-mail" id="email" name="email" ref={userRef} required autoComplete="off"
                        value={email}
                        onChange={handleUsernameChange} />
                </div>

                <div className="formGroup">
                    <input type="password" id="password" name="password" placeholder="Password" required autoComplete="off"
                        value={password}
                        onChange={handlePasswordChange} />
                </div>

                <div className="checkBox">
                    <input type="checkbox" name="checkbox" id="checkbox" />
                    <label htmlFor="checkbox" className="text">Keep me signed in on this device</label>
                </div>

                <div className="formGroup pt-4">
                    <p className="text">Don't have an account yet? <Link to="/registration" className="fw-bold">Register here!</Link></p>
                </div>

                <div className="formGroup">
                    <button type="submit" className="btn2">Sign In</button>
                </div>

            </form>
        </section>
    )

    return content
}

export default Login;