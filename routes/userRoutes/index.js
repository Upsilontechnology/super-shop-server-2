const {
  getAllUser,
  saveUser,
  setAdmin,
  setEmployee,
  getUser,
  cheakAdmin,
  cheakEmployee,
} = require("../../controllers/userController");
const { verifyToken } = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/", getAllUser);
router.get("/:email", getUser);
router.post("/", saveUser);
router.patch("/setAdminRole/:id", setAdmin);
router.patch("/setEmployeeRole/:id", setEmployee);
router.get("/admin/:email", verifyToken, cheakAdmin);
router.get("/employee/:email", verifyToken, cheakEmployee);

module.exports = router;
