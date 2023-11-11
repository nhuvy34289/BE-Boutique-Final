const router = require("express").Router();
const productCtrl = require("../controllers/productCtrl");

router
  .route("/products")
  .get(productCtrl.getAllProducts)
  .post(productCtrl.createNewProduct);

router.post("/productByCategory", productCtrl.getProductsByCategories);

router.get("/pagination", productCtrl.getProductPagination);

router.get("/relatedProducts", productCtrl.getProductRelated);

router
  .route("/product")
  .get(productCtrl.getProduct)
  .patch(productCtrl.updateProduct)
  .delete(productCtrl.deleteProduct);

module.exports = router;
