const router = require("express").Router();
const emailCtrl = require("../controllers/emailCtrl");

router.post("/sendEmail", emailCtrl.sendEmail);

module.exports = router;
