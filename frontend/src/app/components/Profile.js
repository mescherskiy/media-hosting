import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { selectCurrentUser } from "../slices/authSlice";

const Profile = () => {
  const user = useSelector(selectCurrentUser)

  //const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <header className="jumbotron">
        <h3>
          <strong>{user.name}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {user.roles &&
          user.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </motion.div>
  );
};

export default Profile;