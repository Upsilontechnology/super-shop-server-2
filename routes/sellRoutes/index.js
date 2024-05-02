const { updateSoldProducts } = require("../../controllers/productController");
const {
  addSellProduct,
  getSellProduct,
  updateSellProduct,
  deleteSellProduct,
  getSellSingleProduct,
  updateSoldProductStatus,
} = require("../../controllers/sellController");

const router = require("express").Router();

router.post("/", addSellProduct);
router.get("/", getSellProduct);
router.get("/:id", getSellSingleProduct);
router.delete("/:id", deleteSellProduct);
router.put("/:id", updateSellProduct);
router.patch("/soldProducts", updateSoldProducts);
router.patch("/status", updateSoldProductStatus);

module.exports = router;
