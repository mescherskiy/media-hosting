import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RootLayout from "./app/layouts/RootLayout";
import Home from "./app/pages/Home";
import Login from "./app/pages/Login";
import Register from "./app/pages/Register";
import AuthLayout from "./app/layouts/AuthLayout";
import Profile from "./app/pages/Profile";
import Vault from "./app/pages/Vault";
import Photo from "./app/components/Photo";
import NotFound from "./app/pages/NotFound";
import Gallery from "./app/components/Gallery";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>

      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<AuthLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="vault" element={<Vault />} >
          <Route index element={<Gallery />} />
          <Route path="photo/:photoId" element={<Photo />} />
        </Route>
      </Route>

      <Route path="error" element={<NotFound />} />

    </Route>
  )
)

const App = () => {

  return (
    <RouterProvider router={router} />
  )
};

export default App;
