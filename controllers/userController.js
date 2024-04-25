const { default: mongoose } = require("mongoose");
const userSchema = require("../schemas/userSchema");

const userDB = new mongoose.model("User", userSchema);

//get all user
exports.getAllUser = async (req, res) => {
  const { currentPage, itemsPerPage } = req.query;
  try {
    const skip = currentPage * itemsPerPage;
    const items = await userDB.find().skip(skip).limit(itemsPerPage);

    if (!items || items.length === 0) {
      return res.status(404).json({
        message: "No items found",
      });
    }
    const totalCount = await userDB.countDocuments();

    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred while fetching items",
    });
  }
};

//get single User
exports.getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await userDB.findOne({ email: email });
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "unable to get single user data" });
  }
};

//save new user
exports.saveUser = async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const query = await userDB.findOne({ email: user.email });
    if (query) {
      return res
        .status(200)
        .json({ message: "User already exists", success: false });
    }
    const newUser = new userDB(user);
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

//cheak Admin Rule
exports.cheakAdmin = async (req, res) => {
  const email = req.params.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  const query = { email: email };
  const user = await userDB.findOne(query);

  const isAdmin = user?.role === "Admin" ? true : false;

  res.send({ isAdmin });
};

//cheak Employee Rule
exports.cheakEmployee = async (req, res) => {
  const email = req.params.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  const query = { email: email };
  const user = await userDB.findOne(query);

  const isEmployee = user?.role === "Employee" ? true : false;

  res.send({ isEmployee });
};
