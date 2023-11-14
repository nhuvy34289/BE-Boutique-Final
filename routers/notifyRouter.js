const router = require("express").Router();
const notifyCtrl = require("../controllers/notifyCtrl");

router.post("/notify", notifyCtrl.createNewNotify);

router.get("/notifies", notifyCtrl.getNotifies);

router.patch("/isReadNotify", notifyCtrl.isReadNotify);

router.delete("/deleteAllNotify", notifyCtrl.removeAllNotifies);

module.exports = router;
