const {
  getAllUser,
  saveUser,
  setAdmin,
  setEmployee,
} = require("../../controllers/userController");

const router = require("express").Router();

router.get("/users", getAllUser);
router.get("/allUsers", getAllUser);
router.post("/", saveUser);
router.patch("/setAdminRole/:id", setAdmin);
router.patch("/setEmployeeRole/:id", setEmployee);

module.exports = router;
