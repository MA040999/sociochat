const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { resolve } = require("path");
const cors = require("cors");

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 4000;
const whitelist = [
  "https://sociochat.herokuapp.com",
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

if (isProduction) {
  // express will serve up production assets
  app.use(express.static(`client/build`));

  // express will serve up the front-end index.html file if it doesn't recognize the route
  app.get("*", (req, res) => res.sendFile(resolve(`client/build/index.html`)));
}

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});