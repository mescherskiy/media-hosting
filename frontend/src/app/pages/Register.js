import React, { useState } from "react";
import { motion } from "framer-motion";

import { useRegistrationMutation } from "../api/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [inputErrors, setInputErrors] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [registration, registrationResult] = useRegistrationMutation();

  const checkUsername = () => {
    const cleanUsername = username.trim()
    const errorMessages = {}

    // if (!cleanUsername) {
    //   errorMessages.username = "This field is required"
    // } else if (cleanUsername.length < 3 || cleanUsername.length > 20) {
    //   errorMessages.username = "Username must be between 3 and 20 characters"
    // }

    // setInputErrors((prevErrors) => ({
    //   ...prevErrors,
    //   ...errorMessages,
    // }))

    if (!cleanUsername) {
      setInputErrors((rest) => ({
        ...rest,
        username: "This field is required"
      }))
    } else if (username.trim().length < 3 || username.trim().length > 20) {
      setInputErrors((rest) => ({
        ...rest,
        username: "Username must be between 3 and 20 characters."
      }))
    }
  }

  const checkEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%-+]+@[a-z0-9-.]+\.[a-z]{2,}$/;
    if (!email || email.trim() === "") {
      setInputErrors((rest) => ({
        ...rest,
        email: "This field is required"
      }))
    } else if (!emailPattern.test(email.trim())) {
      setInputErrors((rest) => ({
        ...rest,
        email: "This is not a valid email."
      }))
    } else if (email.trim().length > 50) {
      setInputErrors((rest) => ({
        ...rest,
        email: "Email is too long"
      }))
    }
  }

  const checkPassword = () => {
    if (!password || password.trim() === "") {
      setInputErrors((rest) => ({
        ...rest,
        password: "This field is required"
      }))
    } else if (password.trim().length < 6 || password.trim().length > 40) {
      setInputErrors((rest) => ({
        ...rest,
        password: "The password must be between 6 and 40 characters."
      }))
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (Object.values(inputErrors).every(value => value === "")) {
      try {
        console.log(username)
        console.log(email)
        console.log(password)
        await registration({ username, email, password }).unwrap()
        setSuccessMsg("User created successfully!")
      } catch (error) {
        setErrMsg(error.message)
      }
    }
  };

  if (registrationResult.isError) {
    setErrMsg(registrationResult.error.message)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="col-md-12 signup-form mt-5 text-white-50">
        <div className="form-card">
          <h2 className="text-center text-white pt-4 pb-1">Registration</h2>
          <form className="form" onSubmit={handleRegister}>

            <div className="form-group mb-3">
              <input
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setInputErrors((rest) => ({
                    ...rest,
                    username: ""
                  }));
                }}
                onBlur={checkUsername}
                className={`${inputErrors.username ? "is-invalid" : ""}`}
              />
              <label htmlFor="username">Username</label>
              {inputErrors.username && <div className="invalid-feedback">{inputErrors.username}</div>}
            </div>

            <div className="form-group mb-3">
              <input
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInputErrors((rest) => ({
                    ...rest,
                    email: ""
                  }));
                }}
                onBlur={checkEmail}
                className={`${inputErrors.email ? "is-invalid" : ""}`}
              />
              <label htmlFor="email">E-mail</label>
              {inputErrors.email && <div className="invalid-feedback">{inputErrors.email}</div>}
            </div>

            <div className="form-group">
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setInputErrors((rest) => ({
                    ...rest,
                    password: ""
                  }));
                }}
                onBlur={checkPassword}
                className={`${inputErrors.password ? "is-invalid" : ""}`}
              />
              <label htmlFor="password">Password</label>
              {inputErrors.password && <div className="invalid-feedback">{inputErrors.password}</div>}
            </div>

            <div className="form-group d-flex justify-content-between align-items-baseline">
              <button
                type="submit"
                className="submit-btn"
                disabled={registrationResult.isLoading}
              >
                {registrationResult.isLoading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span></span>
                <span></span>
                <span></span>
                <span></span>

                Submit
              </button>
              {errMsg && <div className="error-response">{errMsg}</div>}
              {successMsg && <div className="success-registration">{successMsg}</div>}
            </div>
          </form>
        </div>
      </section>
    </motion.div>
  );
};

export default Register;