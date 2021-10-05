const db = require("../models");
const { v1: uuidv1 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../utils/cloudinary");
require("dotenv").config();

const authenticateUser = async function (req, res) {
  try {
    const user = await db.Users.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    const auth = await bcrypt.compare(req.body.password, user.password);

    if (!auth) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 60 * 10,
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: 60 * 60 * 48,
      }
    );
    res.cookie("__refresh__token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 48,
    });

    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : true,
    //   secure: true,
    //   maxAge: 1000 * 60 * 60 * 4,
    //   // secure: process.env.NODE_ENV === "production" ? true : false,
    // });

    res.status(200).json({
      userData: {
        id: user._id,
        fullname: user.fullname,
        displayImage: user.displayImage,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await db.Users.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    db.Users.create(req.body).then((result) => {
      const refreshToken = jwt.sign(
        {
          id: result._id,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
          expiresIn: 60 * 60 * 48,
        }
      );

      const token = jwt.sign(
        {
          id: result._id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 60 * 10,
        }
      );
      res.cookie("__refresh__token", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 48,
      });
      // res.cookie("jwt", token, {
      //   httpOnly: true,
      //   sameSite: process.env.NODE_ENV === "production" ? "none" : true,
      //   secure: true,
      //   maxAge: 1000 * 60 * 60 * 4,
      // });
      res.status(200).json({
        userData: {
          id: result._id,
          fullname: result.fullname,
          displayImage: result.displayImage,
        },
        token,
        refreshToken,
      });
    });
  } catch {
    res.status(500).json({ message: "Error occured, user not created" });
  }
};

const updateProfile = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const uploadFolderPath = "/uploads/";

  const user = await db.Users.findById(req.userId);

  if (req.body.fullname) {
    user.fullname = req.body.fullname;
  }

  const file = req.body.file ? req.body.file : null;

  if (file) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(file, {
        folder: "userDisplayImages",
      });
      // let extData = file.name.split(".");
      // let ext = extData[extData.length - 1].toString();
      // let imageUrl = uploadFolderPath + uuidv1() + "." + ext;
      // let uploadPath = process.cwd() + imageUrl;
      // file.mv(uploadPath, function (err) {
      //   if (err) return res.status(500).send(err);

      //   console.log("File uploaded!");
      // });
      // user.displayImage = imageUrl;
      user.displayImage = uploadResponse.secure_url;
    } catch (error) {
      console.log(`error`, error);
    }
  }

  const updatedUser = await db.Users.findByIdAndUpdate(req.userId, user, {
    new: true,
  });

  await db.Posts.updateMany(
    { creator: req.userId },
    { name: updatedUser.fullname, displayImage: updatedUser.displayImage }
  );

  await db.Comments.updateMany(
    { creator: req.userId },
    { name: updatedUser.fullname, displayImage: updatedUser.displayImage }
  );

  res.status(200).json({
    id: updatedUser._id,
    fullname: updatedUser.fullname,
    displayImage: updatedUser.displayImage,
  });
};

const verifyAuth = async (req, res) => {
  if (!req.userId)
    return res.status(401).json({ message: "Please login or signup" });

  const user = await db.Users.findById(req.userId);

  return res.status(200).json({
    id: req.userId,
    fullname: user.fullname,
    displayImage: user.displayImage,
  });
};

const logout = (req, res) => {
  res.clearCookie("__refresh__token");
  res.sendStatus(200);
};

const verifyRefreshToken = async (req, res) => {
  const refreshToken =
    req.cookies.__refresh__token || req.headers["x-access-token"];

  if (refreshToken) {
    const decodedTokenData = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    if (decodedTokenData) {
      const { id } = decodedTokenData;
      const token = jwt.sign(
        {
          id: id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 60 * 10,
        }
      );

      const user = await db.Users.findById(id);

      return res.status(200).json({
        userData: {
          id,
          fullname: user.fullname,
          displayImage: user.displayImage,
        },
        token,
      });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
};

module.exports = {
  authenticateUser,
  logout,
  createUser,
  verifyAuth,
  verifyRefreshToken,
  updateProfile,
};
