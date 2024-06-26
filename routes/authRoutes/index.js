const authCookieControler = require("../../controllers/authCookieControler");
const logout = require("../../controllers/logoutController");

const router = require("express").Router();

router.post("/jwt", authCookieControler);
router.get("/logout", logout);

module.exports = router;
