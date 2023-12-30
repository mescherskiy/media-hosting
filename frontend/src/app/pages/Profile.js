import React, { useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useDeleteUserMutation, useGetUserQuery } from "../api/api";

const Profile = () => {
  const { data:user, isSuccess, isError, error, isFetching, isLoading } = useGetUserQuery()
  

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

  //const user = JSON.parse(localStorage.getItem("user"));

  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  if (isFetching || isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>{error}</div>
  }

  if (isSuccess) {
    console.log(user)
  }

  return (
    <motion.div className="container profile-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="profile-img">
        <img src="user-profile-icon.jpg" alt="Profile photo" />
      </div>
      <header className="jumbotron">
        <h3>
          <strong>Profile</strong>
          <br />
          <br />
        </h3>
      </header>
      <p>
        Username: <strong>{user.name}</strong>
      </p>
      <p>
        Email: <strong>{user.email}</strong>
      </p>
      {/* <button className="btn btn-danger" onClick={handleShowModal}>
        Delete profile
        </button>

      {showDeleteModal && (
        <div className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete your profile?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger">Delete</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      )} */}
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