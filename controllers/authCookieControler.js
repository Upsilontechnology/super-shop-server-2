const jwt = require("jsonwebtoken");
require("dotenv").config();
const authCookieControler = () => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "365days",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send({ success: true });
  } catch (err) {
    next(err);
  }
};
module.exports = authCookieControler;
