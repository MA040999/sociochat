const db = require("../models");

const createMessage = async (req, res) => {
  try {
    const newMessage = await db.Message.create(req.body);
    res.status(200).json(newMessage);
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await db.Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
};
