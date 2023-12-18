import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// import NavBar from "./app/components/NavBar";
// import AnimatedRoutes from "./app/components/AnimatedRoutes";
// import { useLogoutMutation } from "./app/api/api";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RootLayout from "./app/layouts/RootLayout";
import Home from "./app/pages/Home";
import Login from "./app/pages/Login";
import Register from "./app/pages/Register";
import AuthLayout from "./app/layouts/AuthLayout";
import Profile from "./app/pages/Profile";
import Vault from "./app/pages/Vault";
import Album from "./app/components/Album";
import Photo from "./app/components/Photo";
import { photoGalleryLoader } from "./app/components/PhotoGallery";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>

      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<AuthLayout />}>
        <Route path="profile" element={<Profile />} />

        <Route path="vault" element={<Vault />} loader={photoGalleryLoader} >
          {/* <Route index element={<Album />} /> */}
          <Route path="photo/:photoId" />
        </Route>

      </Route>

    </Route>
  )
)

const App = () => {

  // const [logoutMutation, logoutMutationResult] = useLogoutMutation()

  return (
    <RouterProvider router={router}/>
  )

  // return (
  //   <>
  //     <NavBar logoutMutation={logoutMutation} logoutMutationResult={logoutMutationResult} />
  //     <AnimatedRoutes />
  //   </>
  // );
};

export default App;
