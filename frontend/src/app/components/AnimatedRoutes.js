import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Vault from "./Dropzone";
import RequireAuth from "./RequireAuth";


const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="profile" element={<Profile />} />
          <Route path="vault/*" element={<Vault />} />
            {/* <Route path="photo/:photoId" element={<Photo />} />
          </Route> */}
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes

