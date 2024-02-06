import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { useLogoutMutation, useUploadPhotoMutation } from "../api/api";
import { selectAuth } from "../slices/authSlice";
import DropzoneButton from "./DropzoneButton";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {

  const [logoutMutation, logoutMutationResult] = useLogoutMutation()

  const navigate = useNavigate();
  const authenticated = useSelector(selectAuth)
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
      <Navbar collapseOnSelect={true} expand="md" className="navbar navbar-dark justify-content-between">
          <Navbar.Brand href="/" className="text-uppercase">Media vault</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto align-items-center flex-row justify-content-around">
              {authenticated ? (
                <>
                  <Nav.Link as={NavLink} eventKey={1} to={"/vault"}>
                    <div className="iconDiv nav-item" tooltip="My Vault" tabIndex="0">
                      <div className="iconSVG">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="white" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                      </div>
                    </div>
                  </Nav.Link>
                  <Nav.Link as={DropzoneButton} uploadPhoto={uploadPhoto} eventKey={2}/>
                  <div className="divider"></div>
                  <Nav.Link as={NavLink} to={"/profile"} eventKey={3}>
                    <div className="iconDiv nav-item" tooltip="Profile" tabIndex="0">
                      <div className="iconSVG">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/" onClick={handleLogout} eventKey={4}>
                    <div className="iconDiv nav-item" tooltip="Log out" tabIndex="0">
                      <div className="iconSVG">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="white" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                      </div>
                    </div>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to={"/login"} eventKey={5}>
                    <div className="iconDiv nav-item" tooltip="Sign in" tabIndex="0">
                      <div className="iconSVG">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="yellow" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    </div>
                  </Nav.Link>
                  <div className="divider"></div>
                  <Nav.Link as={NavLink} to={"/register"} eventKey={6}>
                    <div className="iconDiv nav-item" tooltip="Sign up" tabIndex="0">
                      <div className="iconSVG">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="dodgerblue" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                      </div>
                    </div>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
      </Navbar >
    </>
  )
}

export default NavBar;