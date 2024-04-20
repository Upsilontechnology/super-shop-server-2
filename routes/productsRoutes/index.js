const router = require("express").Router();
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductSearch,
  getProductFilter,
} = require("../../controllers/productController");

router.get("/products", getProducts);
router.get("/products/search", getProductSearch);
router.get("/products/filter", getProductFilter);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
