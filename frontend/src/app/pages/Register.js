import React, { useState } from "react";
import { motion } from "framer-motion";

import { useRegistrationMutation } from "../api/api";
import { Button, Col, Form } from "react-bootstrap";

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
        const res = await registration({ username, email, password }).unwrap()
        if (res.message) {
          setSuccessMsg(res.message)
        } else {
          setErrMsg(res.data?.message)
        }
      } catch (error) {
        setErrMsg(error.data?.message)
      } finally {
        setErrMsg("")
        setSuccessMsg("")
      }
    }
  };

  return (
    <motion.div className="d-flex justify-content-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="signup-form pt-5 text-white-50">
        <div className="form-card">
          <h2 className="text-center text-white pt-4 pb-1">Registration</h2>
          <Form className="form" onSubmit={handleRegister}>
            <Form.Group className="form-group mb-3">
              <Form.Control
                name="username"
                type="text"
                required
                value={username}
                autoComplete="current-username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setInputErrors((rest) => ({
                    ...rest,
                    username: ""
                  }));
                }}
                onBlur={checkUsername}
                isInvalid={inputErrors.username ? "is-invalid" : ""}
              />
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control.Feedback type="invalid">{inputErrors.username}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-5 mt-5">
              <Form.Control
                name="email"
                type="text"
                required
                value={email}
                autoComplete="current-email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInputErrors((rest) => ({
                    ...rest,
                    email: ""
                  }));
                }}
                onBlur={checkEmail}
                isInvalid={inputErrors.email ? "is-invalid" : ""}
              />
              <Form.Label htmlFor="email">E-mail</Form.Label>
              <Form.Control.Feedback type="invalid">{inputErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Control
                name="password"
                type="password"
                required
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setInputErrors((rest) => ({
                    ...rest,
                    password: ""
                  }));
                }}
                onBlur={checkPassword}
                isInvalid={inputErrors.password ? "is-invalid" : ""}
              />
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control.Feedback type="invalid">{inputErrors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} className="form-group reg-btn-and-err d-flex justify-content-between align-items-center">
              <Button
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
              </Button>
              {errMsg && <div className="error-response">{errMsg}</div>}
              {successMsg && <div className="success-registration">{successMsg}</div>}
            </Form.Group>
          </Form>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;