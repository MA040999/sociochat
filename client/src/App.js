import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Messenger from "./components/Messenger";
import Signup from "./components/Signup";
import { verifyRefreshToken } from "./redux/auth/authActions";
import { io } from "socket.io-client";
import Notification from "./components/Notification";

function App() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  const user = useSelector((state) => state.auth.user);
  const notificationMsg = useSelector((state) => state.auth.notificationMsg);

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

  useEffect(() => {
    socket.current = io("ws://localhost:4000");
    user && socket.current.emit("addUser", user?.id);

    user &&
      socket.current.on("getUsers", (users) => {
        const userIds = users.map(({ userId }) => userId);
        const filteredUserIds = userIds.filter((userId) => userId !== user?.id);
        setOnlineUsers(filteredUserIds);
      });
  }, [user]);

  return (
    <>
      {notificationMsg && <Notification />}
      <Switch>
        {!user ? (
          <Route path="/login" exact render={() => <Login socket={socket} />} />
        ) : (
          <Route
            path="/Home"
            exact
            render={() => (
              <Messenger
                user={user}
                socket={socket}
                onlineUsers={onlineUsers}
              />
            )}
          />
        )}

        {user === null && (
          <Route
            path="/signup"
            exact
            render={() => <Signup socket={socket} />}
          />
        )}

        {user ? <Redirect to="/Home" /> : <Redirect to="/login" />}
      </Switch>
    </>
  );
}

export default App;
