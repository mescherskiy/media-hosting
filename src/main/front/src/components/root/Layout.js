import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";

import "./root.css"

const Layout = () => {
  return (
    <>
      <nav className="navbar pt-3">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand fw-bold">MEDIA VAULT</NavLink>
          <div className="menu d-flex align-items-center justify-content-between">
            <NavLink to="/" className="page-link">Home</NavLink>
            <NavLink to="/about" className="page-link">About Us</NavLink>
            <NavLink to="/contacts" className="page-link">Contacts</NavLink>
            <div className="btn-group" role="group">
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
              <Link to="/registration" className="btn btn-warning">Registration</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="main d-flex justify-content-center align-items-center">
        <Outlet />
      </div>

    </>
  )
}

export default Layout;