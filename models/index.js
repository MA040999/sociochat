const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  Users: require("./Users"),
  Message: require("./Message"),
  Conversation: require("./Conversation"),
};
