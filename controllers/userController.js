const { default: mongoose } = require("mongoose");
const userSchema = require("../schemas/userSchema");

const userDB = new mongoose.model("User", userSchema);

//get all user
exports.getAllUser = async (req, res) => {
  try {
    const result = await userDB.find();
    res.send(result);
  } catch (error) {
    res.status(500).json({ msg: "unable to get user data" });
  }
};

//saveUser
exports.saveUser = async (req, res) => {
  try {
    const user = req.body;
    const query = await userDB.findOne({ email: user.email });
    if (query) {
      return res
        .status(200)
        .json({ message: "User already exists", success: false });
    }
    const newUser = new User(user);
    await newUser.save();
    res.status(201).send({ message: "added successfully ", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "unable to get single user data" });
  }
};

//set Admin Rule
exports.setAdmin = async (req, res) => {
  try {
    const result = await userDB.updateOne(
      {
        email: req.params.email,
      },
      {
        $set: {
          role: "admin",
        },
      }
    );
    if (result.modifiedCount === 1) {
      res.status(201).send({
        message: "User role updated successfully",
        success: true,
        modifiedCount: result.modifiedCount,
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Document not found or not modified",
      success: false,
      modifiedCount: result.modifiedCount,
    });
  }
};

//set Employee Rule
exports.setEmployee = async (req, res) => {
  try {
    const result = await userDB.updateOne(
      {
        email: req.params.email,
      },
      {
        $set: {
          role: "employee",
        },
      }
    );
    if (result.modifiedCount === 1) {
      res.status(201).send({
        message: "User role updated successfully",
        success: true,
        modifiedCount: result.modifiedCount,
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Document not found or not modified",
      success: false,
      modifiedCount: result.modifiedCount,
    });
  }
};
