import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";

import { useLogoutMutation, useUploadPhotoMutation } from "../api/api";
import { selectCurrentUser } from "../slices/authSlice";

const NavBar = () => {

  const [logoutMutation, logoutMutationResult] = useLogoutMutation()

  const navigate = useNavigate();
  // const [logout, response] = useLogoutMutation();
  // const [showAdminBoard, setShowAdminBoard] = useState(false);
  const user = useSelector(selectCurrentUser);
  const [uploadPhoto] = useUploadPhotoMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation()
      
    } catch (error) {
      console.error("Logout error: ", error)
    }
  }

  useEffect(() => {
    if (logoutMutationResult.isSuccess) {
      navigate("/")
    }
  }, [logoutMutationResult.isSuccess, navigate])

  return (
    <>
      <nav className="navbar navbar-expand px-5 navbar-dark justify-content-between">
        <Link to={"/"} className="navbar-brand text-uppercase">
          Media vault
        </Link>
        <div className="navbox navbar-nav">
          {user ? (
            <>
              <NavLink to={"/vault"}>
                <div className="iconDiv nav-item" tooltip="My Vault" tabIndex="0">
                  <div className="iconSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="white" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                </div>
              </NavLink>
              <DropzoneButton key={user.email} email={user.email} uploadPhoto={uploadPhoto} />
              {/* <div className="iconDiv nav-item" tooltip="Upload" tabIndex="0">
                <div className="iconSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="white" className="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </div>
              </div> */}
              <div className="divider"></div>
              <NavLink to={"/profile"}>
                <div className="iconDiv nav-item" tooltip="Profile" tabIndex="0">
                  <div className="iconSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </NavLink>
              <a href="/" onClick={handleLogout}>
                <div className="iconDiv nav-item" tooltip="Log out" tabIndex="0">
                  <div className="iconSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="white" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  </div>
                </div>
              </a>
            </>
          ) : (
            <>
              <NavLink to={"/login"}>
                <div className="iconDiv nav-item" tooltip="Sign in" tabIndex="0">
                  <div className="iconSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="yellow" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                </div>
              </NavLink>
              <div className="divider"></div>
              <NavLink to={"/register"}>
                <div className="iconDiv nav-item" tooltip="Sign up" tabIndex="0">
                  <div className="iconSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="dodgerblue" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                  </div>
                </div>
              </NavLink>
            </>
          )}
        </div>
        {/* <Link to={"/"} className="navbar-brand text-uppercase">
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
        )} */}
      </nav >
    </>
  )
}

function DropzoneButton({ email, uploadPhoto }) {
  const onDrop = async (acceptedFiles) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        return uploadPhoto({ email: email, file: formData })
      })
      await Promise.all(uploadPromises)
    } catch (err) {
      console.log(err)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true, accept: { "image/jpeg": [] } })

  return (
    <div className="dropzone-button" {...getRootProps()}>
      <input {...getInputProps()} className="dropzone-btn" />
      <div className="iconDiv nav-item" tooltip="Upload" tabIndex="0">
        <div className="iconSVG">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default NavBar;