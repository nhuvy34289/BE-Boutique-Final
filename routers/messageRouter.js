const router = require("express").Router();
const messageCtrl = require("../controllers/messageCtrl");

router.get("/messages", messageCtrl.getMessages);

router.get("/allMessages", messageCtrl.getAllMessages);

router.post("/send", messageCtrl.sendNewMessage);

router.post("/conversation", messageCtrl.createNewConversation);

module.exports = router;
