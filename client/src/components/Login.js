import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/auth/authActions";
import { validateEmail } from "../common/common";
import { addNotificationMsg } from "../redux/auth/authActions";

function Login({ socket }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  let handleSubmit = function (e) {
    e.preventDefault();
    if (email === "" || password === "") {
      dispatch(addNotificationMsg("Please fill both the fields"));
    } else {
      if (validateEmail(email)) {
        dispatch(login({ email, password }, history, socket));
      } else {
        dispatch(addNotificationMsg("Email address is invalid"));
      }
    }
  };

  return (
    <form className="login-container" onSubmit={(e) => handleSubmit(e)}>
      <div className="login-fields-container">
        <h2>LOGIN</h2>
        <div className="login-input-container">
          <input
            className="login-input"
            label="Email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-btn-container">
          <button type="submit" className="login-btn">
            Login
          </button>
          <div className="login-link-container">
            <p>Don't have an account?</p>
            <button className="btn" onClick={() => history.push("/signup")}>
              Signup
            </button>
          </div>
        </div>
      </div>

      <div className="login-image-container">
        <img className="login-image" src="/login-image.svg" alt="" />
      </div>
    </form>
  );
}

export default Login;
