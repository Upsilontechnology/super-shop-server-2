const mongoose = require("mongoose");
const userSchema = require("../schemas/userSchema");

const User = mongoose.model("User", userSchema);

const verifyEmployee = async (req, res, next) => {
  const email = req.decoded.email;
  try {
    const user = await User.findOne({ email }, { role: 1 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.isEmployee = user.role === "employee";
    next();
  } catch (error) {
    console.error("Error in verifyEmployee middleware:", error);
    res
      .status(500)
      .json({ message: "Error occurred while verifying employee status" });
  }
};

module.exports = {
  verifyEmployee,
};
