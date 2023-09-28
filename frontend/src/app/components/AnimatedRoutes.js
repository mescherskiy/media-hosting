import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Profile from "./Profile";
import UserBoard from "./UserBoard";
import AdminBoard from "./AdminBoard";
import RequireAuth from "./RequireAuth";
import Vault from "./Vault";
import { AnimatePresence } from "framer-motion";

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
          <Route path="user" element={<UserBoard />} />
          <Route path="admin" element={<AdminBoard />} />
          <Route path="vault" element={<Vault />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes

