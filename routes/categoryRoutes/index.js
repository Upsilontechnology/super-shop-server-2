const router = require("express").Router();
const {
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categoryController");

//category route
router.get("/", getCategory);
router.post("/", addCategory);
router.delete("/:categoryId", deleteCategory);
router.put("/:id", updateCategory);

// product route

module.exports = router;
