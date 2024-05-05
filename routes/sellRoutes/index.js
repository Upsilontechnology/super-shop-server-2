const { updateSoldProducts } = require("../../controllers/productController");
const {
  addSellProduct,
  getSellProduct,
  updateSellProduct,
  deleteSellProduct,
  getSellSingleProduct,
  updateSoldProductStatus,
  getSellProductFilter,
} = require("../../controllers/sellController");

const router = require("express").Router();

router.post("/", addSellProduct);
router.get("/", getSellProduct);
// router.get("/notification", getSellProduct);
router.get("/filter", getSellProductFilter);
router.get("/category", getSellProductFilter);
router.get("/:id", getSellSingleProduct);
router.delete("/:id", deleteSellProduct);
router.put("/:id", updateSellProduct);
router.patch("/soldProducts", updateSoldProducts);
router.patch("/status", updateSoldProductStatus);

module.exports = router;
