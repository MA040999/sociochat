const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
      const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.userId = decodedTokenData?.id;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { auth };
