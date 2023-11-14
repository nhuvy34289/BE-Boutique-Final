const router = require("express").Router();
const ratingCtrl = require("../controllers/ratingCtrl");

router
  .route("/rating")
  .post(ratingCtrl.createNewRating)
  .patch(ratingCtrl.updateRating)
  .delete(ratingCtrl.deleteRating);

router.patch("/rating/like", ratingCtrl.likeRating);

router.patch("/rating/unlike", ratingCtrl.unLikeRating);

module.exports = router;
