const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { resolve } = require("path");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    io.emit("getUsers", users);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on(
    "sendMessage",
    ({ senderId, receiverId, conversationId, text, id, createdAt }) => {
      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
        conversationId,
        id,
        createdAt,
      });
    }
  );

  socket.on(
    "initiateConvo",
    ({ senderId, receiverId, conversationId, text, id, createdAt }) => {
      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getNewConvo", {
        senderId,
        text,
        conversationId,
        id,
        createdAt,
      });
    }
  );
});

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 4000;
const whitelist = [
  "https://socio-chat.herokuapp.com",
  "http://localhost:3000",
  "http://localhost:19002",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(cors(corsOptions));

// app.use("/uploads", express.static("uploads"));

app.use("/auth/", require("./routes/auth"));
app.use("/conversation/", require("./routes/conversation"));
app.use("/message/", require("./routes/message"));

if (isProduction) {
  // express will serve up production assets
  app.use(express.static(`client/build`));

  // express will serve up the front-end index.html file if it doesn't recognize the route
  app.get("*", (req, res) => res.sendFile(resolve(`client/build/index.html`)));
}

httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
