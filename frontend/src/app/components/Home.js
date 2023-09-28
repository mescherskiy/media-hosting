import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slices/authSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogoutMutation } from "../api/api";


const Home = () => {
  const user = useSelector(selectCurrentUser)
  const [logout] = useLogoutMutation()

  useEffect(() => {
    if (!user) {
      logout()
    }
  }, [user, logout])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} >
      <section className="main d-flex flex-column justify-content-center align-items-center text-white">
        <h1 className="p-3">Experience your memories like never before</h1>
        <h2 className="magic-text p-3">Create. Collect. Share.</h2>
        {user
          ? (
              <Link to="/vault" className="btn-homepage btn btn-lg btn-outline-light m-3">
              MY VAULT
              </Link>
          )
          : (
              <Link to="/login" className="btn-homepage btn btn-lg btn-outline-light m-3">
              BEGIN
              </Link>
          )}
      </section>
    </motion.div>

    // <div className="container">
    //   <header className="jumbotron">
    //     <h3>{response.message}</h3>
    //   </header>
    // </div>
  );
};

export default Home;