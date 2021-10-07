const router = require("express").Router();
const messageController = require("../controllers/message-controller");

router.get('/:conversationId', messageController.getMessages)
router.post('/', messageController.createMessage)

module.exports = router;