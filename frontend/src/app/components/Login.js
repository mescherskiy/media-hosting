import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/api";
import { setCredentials } from "../slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [invalidEmailMsg, setInvalidEmailMsg] = useState("");
  const [invalidPasswordlMsg, setInvalidPasswordMsg] = useState("");

  const [login, loginResult] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate("/vault");
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="login col-md-12 login-form mt-5 text-white-50">
        <div className="form-card">
          <h2 className="text-center text-white pt-4 pb-1">Login</h2>
          <form className="form" onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <input
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInvalidEmailMsg("");
                }}
                onBlur={() => {
                  if (!email) {
                    setInvalidEmailMsg("This field is required!");
                  }
                }}
                className={`${invalidEmailMsg ? "is-invalid" : ""}`}
              />
              <label htmlFor="email">E-mail</label>
              {invalidEmailMsg && <div className="invalid-feedback">{invalidEmailMsg}</div>}
            </div>

            <div className="form-group">
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setInvalidPasswordMsg("");
                }}
                onBlur={() => {
                  if (!password) {
                    setInvalidPasswordMsg("This field is required!");
                  }
                }}
                className={`${invalidPasswordlMsg ? "is-invalid" : ""}`}
              />
              <label htmlFor="password">Password</label>
              {invalidPasswordlMsg && <div className="invalid-feedback">{invalidPasswordlMsg}</div>}
            </div>

            <div className="form-group d-flex justify-content-between align-items-baseline">
              <button
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
              </button>
              {errMsg && <div className="error-response">{errMsg}</div>}
            </div>
          </form>
        </div>
      </section>
    </motion.div>
  );
};

export default Login;