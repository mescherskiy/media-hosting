import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../slices/authSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Button } from "react-bootstrap";

const Home = () => {
  const authenticated = useSelector(selectAuth)
  const initialState = {
    name: "START",
    link: "/login"
  }
  const [button, setButton] = useState(initialState)

  useEffect(() => {
    if (authenticated) {
      setButton({ name: "MY VAULT", link: "/vault" })
    }
    return () => {setButton(initialState)}
  }, [authenticated])

  return (
    <motion.div className="homepage d-flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} >
      <Container className="d-flex flex-column justify-content-center align-items-center text-white">
        <h1 className="magic-text p-3">Create. Collect. Share.</h1>
        <Link to={button.link}>
          <Button size="lg" className="submit-btn">
            <span></span>
            <span></span>
            <span></span>
            <span></span>

            {button.name}
          </Button>
        </Link>
      </Container>
    </motion.div>
  );
};

export default Home;