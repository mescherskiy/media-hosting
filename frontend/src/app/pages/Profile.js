import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useDeleteUserMutation, useGetUserQuery } from "../api/api";

const Profile = () => {
  const { data: user, isError, error, isFetching, isLoading } = useGetUserQuery()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteUser, response] = useDeleteUserMutation();
  const navigate = useNavigate()

  const handleShowModal = () => setShowDeleteModal(true)

  const handleCloseModal = () => setShowDeleteModal(false)

  const handleDeleteProfile = async () => {
    await deleteUser()
    console.log(response)
    if (response.data?.status === 200) {
      navigate("/")
    }
  }

  if (isFetching || isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>{error}</div>
  }

  return (
    <motion.div className="container profile-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="profile-img">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="3 3 18 18" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="jumbotron">
        <h3>
          <strong>Profile</strong>
          <br />
          <br />
        </h3>
      </div>
      <p>
        Username: <strong>{user.name}</strong>
      </p>
      <p>
        Email: <strong>{user.email}</strong>
      </p>
      <Button variant="danger" onClick={handleShowModal}>
        Delete profile
      </Button>

      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete user</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete your profile?</Modal.Body>
        <Modal.Footer>
          <Button variant="seondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteProfile}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default Profile;