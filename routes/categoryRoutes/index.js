const router = require("express").Router();
const {
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categoryController");

//category route
router.get("/category", getCategory);
router.post("/category", addCategory);
router.delete("/category/:id", deleteCategory);
router.put("/category/:id", updateCategory);

// product route

module.exports = router;
