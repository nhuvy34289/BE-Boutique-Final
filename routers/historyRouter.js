const router = require("express").Router();
const historyCtrl = require("../controllers/historyCtrl");

router
  .route("/histories")
  .get(historyCtrl.getAllHistories)
  .post(historyCtrl.createNewHistory);

router
  .route("/history")
  .patch(historyCtrl.updateHistory)
  .delete(historyCtrl.deleteHistory);

router.get("/monthlyIncome", historyCtrl.getMonthlyIcomes);

router.get("/userHistory", historyCtrl.getUserHistories);

module.exports = router;
