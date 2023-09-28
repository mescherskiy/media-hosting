import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useLogoutMutation } from "../api/api";
import { selectCurrentUser } from "../slices/authSlice";

const Layout = () => {

  const [logout] = useLogoutMutation();
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user) {
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"))
    } else {
      setShowAdminBoard(false)
    }
  }, [user])

  return (
    <>
      <nav className="navbar navbar-expand px-5 navbar-dark justify-content-between">
        <Link to={"/"} className="navbar-brand text-uppercase">
          Media vault
        </Link>
        <div className="navbar-nav mr-auto">
          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}
          {user && (
            <li className="nav-item">
              <Link to={"/vault"} className="nav-link">
                My photos
              </Link>
            </li>
          )}
        </div>

        {user ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link fw-medium">
                {(user.name).toUpperCase()}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/" className="nav-link fw-medium" onClick={logout}>
                Logout
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link fw-medium">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link fw-medium">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  )
}

export default Layout;