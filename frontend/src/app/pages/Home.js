import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../slices/authSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Notification from "../components/Notification";
import { Container, Button } from "react-bootstrap";

const Home = () => {
  const authenticated = useSelector(selectAuth)
  const buttonName = "START"
  const linkTo = "/login"

  useEffect(() => {
    if (authenticated) {
      buttonName = "MY VAULT"
      linkTo = "/vault"
    } else {
      buttonName = "START"
      linkTo = "/login"
    }
  }, [authenticated])

  return (
    <motion.div className="homepage d-flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} >
      <Notification />
      <Container className="d-flex flex-column justify-content-center align-items-center text-white">
        {/* <h1 className="p-3">Experience your memories like never before</h1> */}
        <h1 className="magic-text p-3">Create. Collect. Share.</h1>
        <Link to={linkTo}>
          <Button size="lg" className="submit-btn">
            <span></span>
            <span></span>
            <span></span>
            <span></span>

            {buttonName}
          </Button>
        </Link>
      </Container>
    </motion.div>
  );
};

export default Home;