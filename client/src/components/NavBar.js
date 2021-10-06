import React from "react";
import { connect } from "react-redux";
import { logout } from "../redux/auth/authActions";
import { Link, useHistory } from "react-router-dom";

function NavBar(props) {
  const { user, logout } = props;

  const history = useHistory();

  const handleClick = () => {
    logout(history);
  };

  return (
    <div className="navbar">
      <div>
        <Link to="/">
          <img className="logo" src="logo.png" alt="logo" />
        </Link>
      </div>
      <nav>
        <ul>
          {user ? (
            <div className="authenticated">
              <li>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={handleClick}
                  className="link nav-item"
                >
                  Logout
                </div>
              </li>
            </div>
          ) : (
            <li>
              <Link to="/login" className="link nav-item">
                Login
              </Link>
            </li>
          )}

          {user ? (
            ""
          ) : (
            <li>
              <Link to="/signup" className="link nav-item">
                Sign Up
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    err: state.auth.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (history) => dispatch(logout(history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
