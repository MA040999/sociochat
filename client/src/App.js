import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Messenger from "./components/Messenger";
import Signup from "./components/Signup";
import { verifyRefreshToken } from "./redux/auth/authActions";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const refreshToken = () => {
    dispatch(verifyRefreshToken());
    setTimeout(() => {
      refreshToken();
    }, 600000 - 1000); //10 minutes - 1 second
  };

  useEffect(() => {
    refreshToken();

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Switch>
        {!user ? (
          <Route path="/login" exact render={() => <Login />} />
        ) : (
          <Route path="/Home" exact component={Messenger} />
        )}

        {user === null && (
          <Route path="/signup" exact render={() => <Signup />} />
        )}

        {user ? <Redirect to="/Home" /> : <Redirect to="/login" />}
      </Switch>
    </>
  );
}

export default App;
