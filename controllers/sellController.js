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
    let query = {};
    if (role === "Admin") {
      query = { branch: branch };
    } else if (role === "Employee") {
      if (!email) {
        return res
          .status(400)
          .json({ message: "Missing email for employee role" });
      }
      query = { email, branch: branch };
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }
    if (status === "approved") {
      query.status = status;
    } else if (status === "pending") {
      query.status = status;
    }

    if (branch) {
      query.branch = branch;
    }

    let skip = 0;
    if (currentPage && itemsPerPage) {
      skip = parseInt(currentPage) * parseInt(itemsPerPage);
      // console.log(skip);
    }

    const [items, totalCount] = await Promise.all([
      sellProductsDB
        .find(query)
        .skip(skip)
        .sort({ deliveryDate: -1 })
        .limit(itemsPerPage),
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
// get data by category
exports.getSellProductCategory = async (req, res) => {
  try {
    const { role, email, branch, status, category } = req.query;
    // console.log(branch);
    // console.log(req.query);
    let query = {};

    if (status === "approved") {
      query.status = status;
    }

    if (role === "Admin") {
      query = { branch: branch };
    } else if (role === "Employee") {
      if (!email) {
        return res
          .status(400)
          .json({ message: "Missing email for employee role" });
      }
      query = { email, branch: branch };
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }
    // console.log(query)
    if (category) {
      query.category = category;
    }

    const data = await sellProductsDB.find(query);
    // console.log('category console', data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving sell products" });
  }
};
// get data by filter
exports.getSellProductFilter = async (req, res) => {
  try {
    const { role, email, filterName, branch, status, category } = req.query;
    // console.log('clicked');
    let query = {};

    if (status === "approved") {
      query.status = status;
    }

    if (role === "Admin") {
      query = { branch: branch };
    } else if (role === "Employee") {
      if (!email) {
        return res
          .status(400)
          .json({ message: "Missing email for employee role" });
      }
      query = { email, branch: branch };
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }
    // console.log(query)
    if (category) {
      query.category = category;
    }
    // console.log(query);
    if (filterName === "daily") {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      query.sellingDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "weekly") {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));
      endDate.setHours(23, 59, 59, 999);
      query.sellingDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "monthly") {
      const startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      query.sellingDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "yearly") {
      const startDate = new Date();
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      query.sellingDate = { $gte: startDate, $lte: endDate };
    }
    const data = await sellProductsDB.find(query);
    console.log('filter console', data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving sell products" });
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
