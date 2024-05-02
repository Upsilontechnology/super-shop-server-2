const { default: mongoose, models } = require("mongoose");
const sellProductSchema = require("../schemas/sellProductSchema");

const sellProductsDB = new mongoose.model("sellProductsDB", sellProductSchema);

exports.addSellProduct = async (req, res) => {
  try {
    const data = req.body;
    const sellProductsData = new sellProductsDB(data);
    await sellProductsData.save();
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "error",
      error: err.message,
    });
  }
};

exports.getSellProduct = async (req, res) => {
  try {
    const { email, role, currentPage, itemsPerPage, status, branch } =
      req.query;

    if (!["Employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid user role" });
    }
    const query = {};

    if (role === "Employee") {
      if (!email) {
        return res
          .status(400)
          .json({ message: "Missing email for employee role" });
      }
      query.email = email;
    }

    if (status) {
      query.status = status;
    }

    if (branch) {
      query.branch = branch;
    }

    let skip = 0;
    if (currentPage && itemsPerPage) {
      skip = parseInt(currentPage) * parseInt(itemsPerPage);
    }

    const [items, totalCount] = await Promise.all([
      sellProductsDB
        .find(query)
        .skip(skip)
        .limit(parseInt(itemsPerPage))
        .sort({ deliveryDate: -1 }),
      sellProductsDB.countDocuments(query),
    ]);

    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while searching for items" });
  }
};

exports.getSellSingleProduct = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new Object(id) };
  try {
    const result = await sellProductsDB.find(query);
    res.send(result);
  } catch (error) {
    res.status(500).json({ msg: "unable to get product data" });
  }
};

exports.deleteSellProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new Object(id) };

    const result = await sellProductsDB.deleteOne(query);
    if (result.deletedCount === 1) {
      res.status(201).send({
        message: "Product deleted successfully",
        success: true,
        deletedCount: result.deletedCount,
      });
    }
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.updateSellProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await sellProductsDB.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Products not found" });
    } else {
      res.status(200).json({
        message: "success",
      });
    }
  } catch (error) {
    console.error("Error updating sell product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateSoldProductStatus = async (req, res) => {
  try {
    const updatedProducts = await sellProductsDB.updateMany(
      { status: "pending" },
      { $set: { status: "approved" } },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      updatedProducts,
    });
  } catch (error) {
    console.error("Error updating sell product status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
