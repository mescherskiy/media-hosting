import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDeleteUserMutation, useEditUserMutation, useGetUserQuery } from "../api/api";
import { useDispatch } from "react-redux";
import { setGreenNotification, setNotificationMessage, showNotification } from "../slices/authSlice";
import { Form } from "react-bootstrap";

const Profile = () => {
  const { data: user, isError, error, isSuccess } = useGetUserQuery()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [deleteUser, response] = useDeleteUserMutation();
  const [edit] = useEditUserMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleShowModal = () => setShowDeleteModal(true)

  const handleCloseModal = () => setShowDeleteModal(false)

  const handleDeleteProfile = async () => {
    await deleteUser()
    console.log(response)
    if (response.data?.status === 200) {
      navigate("/")
    }
  }

  const [credentials, setCredentials] = useState({
    name: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const initialState = {
    name: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  }

  const [inputErrors, setInputErrors] = useState(initialState)

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    if (isSuccess) {
      setCredentials((rest) => ({
        ...rest,
        name: user.name
      }))
    }
  }, [isSuccess, user])

  const checkUsername = () => {
    const cleanUsername = credentials.name?.trim()

    if (!cleanUsername) {
      setInputErrors((rest) => ({
        ...rest,
        name: "This field is required"
      }))
    } else if (cleanUsername.length < 3 || cleanUsername.length > 20) {
      setInputErrors((rest) => ({
        ...rest,
        name: "Username must be between 3 and 20 characters."
      }))
    }
  }

  const checkOldPassword = () => {
    if (!credentials.oldPassword || credentials.oldPassword.trim() === "") {
      setInputErrors((rest) => ({
        ...rest,
        oldPassword: "This field is required"
      }))
    }
  }

  const checkNewPassword = () => {
    const cleanNewPassword = credentials.newPassword.trim()
    if (cleanNewPassword != 0 && (cleanNewPassword.length < 6 || cleanNewPassword.length > 40)) {
      setInputErrors((rest) => ({
        ...rest,
        newPassword: "Password must be between 6 and 40 chars."
      }))
    }
  }

  useEffect(() => {
    if (credentials.newPassword !== credentials.confirmPassword) {
      setInputErrors((rest) => ({
        ...rest,
        confirmPassword: "Passwords don't match"
      }))
    } else {
      setInputErrors((rest) => ({
        ...rest,
        confirmPassword: ""
      }))
    }
  }, [credentials.newPassword, credentials.confirmPassword])

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (Object.values(inputErrors).every(value => value === "")) {
      try {
        const name = credentials.name
        const oldPassword = credentials.oldPassword
        const newPassword = credentials.newPassword
        console.log("creds: ", name, oldPassword, newPassword)
        const res = await edit({ name, oldPassword, newPassword }).unwrap();
        setCredentials({
          ...initialState,
          name: name
        })
        setIsFlipped(false)
        console.log("res: ", res)
        dispatch(setNotificationMessage(res.message))
        dispatch(setGreenNotification(true))
        dispatch(showNotification(true))
      } catch (error) {
        console.log("error in catch: ", error)
        if (error.status === 418) {
          setInputErrors((rest) => ({
            ...rest,
            oldPassword: error.data?.message || error.message
          }))
        } else {
          dispatch(setNotificationMessage(error.data?.message || error.message))
          dispatch(showNotification(true))
        }
      }
    }
  };

  const handleCloseEditProfile = () => {
    setIsFlipped(false)
    setCredentials({...initialState, name: credentials.name})
    setShowPassword({old: false, new: false, confirm: false})
  }

  if (isError) {
    return <div>{error}</div>
  }

  return (
    <motion.div className={`profile-container ${isFlipped ? "flipped" : "unflipped"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="profile-card">
        <div className="front">
          <h3 className="text-center font-weight-bold">Profile</h3>
          <div className="profile-img">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="3 3 18 18" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
          </div>
          <h4>
            Username: <strong>{user?.name || ""}</strong>
          </h4>
          <h4>
            Email: <strong>{user?.email || ""}</strong>
          </h4>
          <Button variant="success" onClick={() => setIsFlipped(true)}>Edit profile</Button>
          <Button variant="danger" onClick={handleShowModal}>
            Delete profile
          </Button>

          <Modal show={showDeleteModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Delete user</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete your profile?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteProfile}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </div>


        <div className="back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="3 3 18 18" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" onClick={handleCloseEditProfile}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h3 className="text-center font-weight-bold">Edit profile</h3>
          <Form className='form d-flex flex-column justify-content-between h-100' onSubmit={handleEditProfile}>
            <Form.Group className="form-group">
              <Form.Control
                name='name'
                type='text'
                required
                value={credentials.name}
                autoComplete='new-name'
                onChange={(e) => {
                  setCredentials((creds) => ({
                    ...creds,
                    name: e.target.value
                  }))
                  setInputErrors((errors) => ({
                    ...errors,
                    name: ""
                  }))
                }}
                onBlur={checkUsername}
                isInvalid={inputErrors.name ? "is-invalid" : ""}
              />
              <Form.Label htmlFor='name'>Name</Form.Label>
              <Form.Control.Feedback type="invalid">{inputErrors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Control
                name='old-password'
                type={showPassword.old ? "text " : "password"}
                required
                value={credentials.oldPassword}
                autoComplete='old-password'
                onChange={(e) => {
                  setCredentials((creds) => ({
                    ...creds,
                    oldPassword: e.target.value
                  }))
                  setInputErrors((errors) => ({
                    ...errors,
                    oldPassword: ""
                  }))
                }}
                onBlur={checkOldPassword}
                isInvalid={inputErrors.oldPassword ? "is-invalid" : ""}
              />
              <div className="show-password-btn" onClick={() => setShowPassword((rest) => ({ ...rest, old: !rest.old }))}>
                {showPassword.old ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </div>
              <Form.Label htmlFor='old-password'>Old password</Form.Label>
              <Form.Control.Feedback type="invalid">{inputErrors.oldPassword}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={`form-group not-required ${credentials.newPassword.length > 0 ? "filled" : "unfilled"}`}>
              <Form.Control
                name='password'
                type={showPassword.new ? "text " : "password"}
                value={credentials.newPassword}
                autoComplete='new-password'
                onChange={(e) => {
                  setCredentials((creds) => ({
                    ...creds,
                    newPassword: e.target.value
                  }))
                  setInputErrors((errors) => ({
                    ...errors,
                    newPassword: ""
                  }))
                }}
                onBlur={checkNewPassword}
                isInvalid={inputErrors.newPassword ? "is-invalid" : ""}
              />
              <div className="show-password-btn" onClick={() => setShowPassword((rest) => ({ ...rest, new: !rest.new }))}>
                {showPassword.new ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </div>
              <Form.Label htmlFor='password'>New password</Form.Label>
              <Form.Control.Feedback type="invalid">{inputErrors.newPassword}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={`form-group not-required ${credentials.confirmPassword.length > 0 ? "filled" : "unfilled"}`}>
              <Form.Control
                name='confirm-password'
                type={showPassword.confirm ? "text " : "password"}
                value={credentials.confirmPassword}
                onChange={(e) => {
                  setCredentials((creds) => ({
                    ...creds,
                    confirmPassword: e.target.value
                  }))
                  setInputErrors((errors) => ({
                    ...errors,
                    confirmPassword: ""
                  }))
                }}
                isInvalid={inputErrors.confirmPassword ? "is-invalid" : ""}
              />
              <div className="show-password-btn" onClick={() => setShowPassword((rest) => ({ ...rest, confirm: !rest.confirm }))}>
                {showPassword.confirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </div>
              <Form.Label htmlFor='confirm-password'>Confirm password</Form.Label>
              <Form.Control.Feedback type="invalid">{inputErrors.confirmPassword}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group d-flex justify-content-between align-items-baseline">
              <Button
                type="submit"
                className="submit-btn m-0"
              >

                <span></span>
                <span></span>
                <span></span>
                <span></span>

                Save changes
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;