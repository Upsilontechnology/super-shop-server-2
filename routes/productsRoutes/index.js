const router = require("express").Router();
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductSearch,
  getProductFilter,
  getSingleProduct,
  getProductStatistics,
} = require("../../controllers/productController");

router.get("/", getProducts);
router.get("/search", getProductSearch);
router.get("/:id", getSingleProduct);
router.get("/filter", getProductFilter);
router.get("/filter", getProductFilter);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/1/state", getProductStatistics);

module.exports = router;
