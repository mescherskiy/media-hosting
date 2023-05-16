import React from "react";
import { Link } from "react-router-dom";

import "./main.css";

const Main = () => {
    return (
        <main className="d-flex flex-column justify-content-center align-items-center">
            <h1>Experience your memories like never before</h1>
            <h2>Create. Collect. Share.</h2>
            <Link to="/login" className="btn btn-lg btn-outline-dark">BEGIN</Link>
        </main>
    )
}

export default Main;