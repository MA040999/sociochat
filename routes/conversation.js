const router = require("express").Router();
const conversationController = require("../controllers/conversation-controller");

router.get('/:userId', conversationController.getConversations)
router.post('/create-conversation', conversationController.createConversation)

module.exports = router;