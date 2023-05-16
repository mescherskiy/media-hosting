import React from "react";

import "./navigation.css";

const Navigation = () => {
    return (
        <nav className="navbar">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold">MEDIA VAULT</a>
                <div className="menu d-flex align-items-center justify-content-between w-25">
                    <a>About Us</a>
                    <a>Contacts</a>
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-secondary">Sign In</button>
                        <button type="button" className="btn btn-warning">Registration</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation;