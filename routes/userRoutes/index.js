const {
  getAllUser,
  saveUser,
  setAdmin,
  setEmployee,
  getUser,
} = require("../../controllers/userController");

const router = require("express").Router();

router.get("/", getAllUser);
router.get("/:email", getUser);
router.post("/", saveUser);
router.patch("/setAdminRole/:id", setAdmin);
router.patch("/setEmployeeRole/:id", setEmployee);

module.exports = router;
