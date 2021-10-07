const db = require("../models");

const createConversation = async (req, res) => {
    try {
        const newConversation = await db.Conversation.create({
            members: [req.body.senderId, req.body.receiverId]
        })
        res.status(200).json(newConversation)
    } catch (error) {
        console.log(`error`, error)
        res.status(500).json(error)
    }
}

const getConversations = async (req, res) => {
    try {
        const conversations = await db.Conversation.find({
            members: {$in: [req.params.userId]}
        })

        res.status(200).json(conversations)

    } catch (error) {
        console.log(`error`, error)
        res.status(500).json(error)
    }
}

module.exports = {
   getConversations,
   createConversation,
};