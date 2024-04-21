const router = require("express").Router();
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductSearch,
  getProductFilter,
} = require("../../controllers/productController");

router.get("/", getProducts);
router.get("/search", getProductSearch);
router.get("/filter", getProductFilter);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
