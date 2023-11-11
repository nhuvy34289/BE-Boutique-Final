const router = require("express").Router();
const cartCtrl = require("../controllers/cartCtrl");

router.route("/carts").post(cartCtrl.createNewCart).put(cartCtrl.updateCart);

router.put("/cart/increase", cartCtrl.increaseCartItem);

router.put("/cart/decrease", cartCtrl.decreaseCartItem);

router.get("/userCart", cartCtrl.getUserCart);

router.delete("/carts", cartCtrl.deleteCart);

module.exports = router;
