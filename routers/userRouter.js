const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middlewares/auth");

router
  .route("/user")
  .get(userCtrl.getUser)
  .delete(userCtrl.deleteUser)
  .patch(userCtrl.updateUser);

router.get("/allUsers", userCtrl.getAllUsers);

router.get("/search", userCtrl.searchUser);

router.get("/userStats", userCtrl.getUsersStats);

router.patch("/updateUserFromAdmin", userCtrl.updateUserFromAdmin);

router.patch("/updatePasswordFromAdmin", userCtrl.updatePasswordFromAdmin);

router.patch("/favourite", userCtrl.addFavourite);

router.patch("/removeFavourite", userCtrl.removeFavourite);

router.patch("/changePassword", userCtrl.changePassword);

router.post("/forgot", userCtrl.forgotPassword);

router.post("/resetPassword", userCtrl.resetPassword);

module.exports = router;
