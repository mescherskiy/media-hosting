import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/api";
import { logIn } from "../slices/authSlice";
import { setIsOpen } from "../slices/photoSlice";
import { Button, Col, Form } from "react-bootstrap";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [invalidEmailMsg, setInvalidEmailMsg] = useState("");
  const [invalidPasswordlMsg, setInvalidPasswordMsg] = useState("");

  const [login, loginResult] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e, setValue, setInvalidMsg) => {
    const value = e.target.value
    setValue(value)
    setInvalidMsg(value ? "" : "This field is required")
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login({ email, password }).unwrap();
      dispatch(logIn());

      const lastVisitedPath = localStorage.getItem("lastVisitedPath")
      if (lastVisitedPath) {
        localStorage.removeItem("lastVisitedPath")
        const pattern = /\/photo\/\d+$/
        if (pattern.test(lastVisitedPath)) {
          dispatch(setIsOpen(true))
        }
        navigate(lastVisitedPath)
      } else {
        navigate("/vault");
      }
    } catch (error) {
      if (!error.status) {
        setErrMsg("No Server Response");
      } else if (error.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (error.status === 401) {
        setErrMsg(error.data.message);
      } else {
        setErrMsg("Login failed");
      }
    }
  };

  return (
    <motion.div className="d-flex justify-content-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="login login-form pt-5 text-white-50">
        <div className="form-card">
          <h2 className="text-center text-white pt-4 pb-1">Login</h2>
          <Form className="form" onSubmit={handleLogin}>
            <Form.Group className="form-group mb-5">
              <Form.Control
                name="email"
                type="text"
                required
                value={email}
                autoComplete="current-email"
                onChange={(e) => handleInputChange(e, setEmail, setInvalidEmailMsg)}
                onBlur={() => handleInputChange( { target: { value: email } }, setEmail, setInvalidEmailMsg)}
                className={invalidEmailMsg ? "is-invalid" : ""}
              />
              <Form.Label htmlFor="email">E-mail</Form.Label>
              {invalidEmailMsg && <Form.Text className="invalid-feedback">{invalidEmailMsg}</Form.Text>}
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Control
                name="password"
                type="password"
                required
                value={password}
                autoComplete="current-password"
                onChange={(e) => handleInputChange(e, setPassword, setInvalidPasswordMsg)}
                onBlur={() => handleInputChange({ target: {value: password} }, setPassword, setInvalidPasswordMsg)}
                className={invalidPasswordlMsg ? "is-invalid" : ""}
              />
              <Form.Label htmlFor="password">Password</Form.Label>
              {invalidPasswordlMsg && <Form.Text className="invalid-feedback">{invalidPasswordlMsg}</Form.Text>}
            </Form.Group>

            <p className="registration-string text-center">Not registered? <Link to="../register">Create an account</Link></p>

            <Form.Group as={Col} className="form-group d-flex justify-content-between align-items-baseline">
              <Button
                type="submit"
                className="submit-btn"
                disabled={loginResult.isLoading}
              >
                {loginResult.isLoading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Submit
              </Button>
              {errMsg && <div className="error-response">{errMsg}</div>}
            </Form.Group>
          </Form>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;