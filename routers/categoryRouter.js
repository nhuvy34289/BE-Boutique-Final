const router = require("express").Router();
const categoryCtrl = require("../controllers/categoryCtrl");
const auth = require("../middlewares/auth");

router
  .route("/categories")
  .get(categoryCtrl.getAllCategory)
  .post(categoryCtrl.createNewCategory);

router
  .route("/category/:id")
  .put(categoryCtrl.updateCategory)
  .delete(categoryCtrl.deleteCategory);

module.exports = router;
