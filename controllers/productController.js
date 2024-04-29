const { default: mongoose, models } = require("mongoose");
const productSchema = require("../schemas/productSchema");

const productsDB = new mongoose.model("Products", productSchema);

exports.getProducts = async (req, res) => {
  const { branch } = req.query;
  try {
    const result = await productsDB.find();
    res.send(result);
  } catch (error) {
    res.status(500).json({ msg: "unable to get product data" });
  }
};

// exports.getProductSearch = async (req, res) => {
//   const {
//     email,
//     searchValue,
//     role,
//     currentPage,
//     itemsPerPage,
//     status,
//     branch,
//   } = req.query;
//   try {
//     let query = {};
//     if (role === "employee") {
//       if (!email) {
//         return res
//           .status(400)
//           .json({ message: "Missing email for employee role" });
//       }
//       query.email = email;
//     } else if (role === "admin") {
//       query = {};
//     } else {
//       return res.status(400).json({ message: "Invalid user" });
//     }

//     if (searchValue && searchValue.trim() !== " ") {
//       query.$or = [{ productCode: searchValue }];
//     }
//     if (searchValue && searchValue.trim() !== " ") {
//       query.$or = [{ category: searchValue }];
//     }

//     if (status) {
//       query.status = status;
//     }
//     if (branch) {
//       query.branch = branch;
//     }

//     const skip = currentPage * itemsPerPage;

//     const items = await productsDB
//       .find(query)
//       .skip(skip)
//       .limit(itemsPerPage)
//       .sort({ deliveryDate: -1 });

//     if (!items || items.length === 0) {
//       return res.status(404).json({
//         message: "No items found for the given email and search term",
//       });
//     }
//     // Total number of blogs
//     const totalCount = await productsDB.countDocuments(query);
//     res.status(200).json({ items, totalCount });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Error occurred while searching for items",
//     });
//   }
// };

//product search
exports.getProductSearch = async (req, res) => {
  const {
    email,
    searchValue,
    role,
    currentPage,
    itemsPerPage,
    status,
    branch,
  } = req.query;
  try {
    let query = {};

    if (role === "employee") {
      if (!email) {
        return res
          .status(400)
          .json({ message: "Missing email for employee role" });
      }
      query.email = email;
    } else if (role === "admin") {
    } else {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (searchValue && searchValue.trim() !== "") {
      query.$or = [{ productCode: searchValue }, { category: searchValue }];
    }

    if (status) {
      query.status = status;
    }
    if (branch) {
      query.branch = branch;
    }

    const skip = currentPage * itemsPerPage;

    const projection = {
      _id: 0,
      productCode: 1,
      category: 1,
      deliveryDate: 1,
      status: 1,
      branch: 1,
    };

    const items = await productsDB
      .find(query, projection)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ deliveryDate: -1 });

    if (!items || items.length === 0) {
      return res.status(404).json({
        message: "No items found for the given email and search term",
      });
    }
    const totalCount = await productsDB.countDocuments(query);
    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred while searching for items",
    });
  }
};

exports.getProductFilter = async (req, res) => {
  const { filterName } = req.query;

  try {
    let query = {};

    if (filterName === "daily") {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "weekly") {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));
      endDate.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "monthly") {
      const startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "yearly") {
      const startDate = new Date();
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: startDate, $lte: endDate };
    }

    const data = await OrderProduct.find(query);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving sell products" });
  }
};
//add product
exports.addProduct = async (req, res) => {
  try {
    const data = req.body;
    const productsData = new productsDB(data);
    await productsData.save().then(() => {
      res.status(200).json({
        message: "success",
      });
    });
  } catch (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "error",
      });
    }
  }
};
//delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const query = { _id: new Object(productId) };

    const deletedCount = await productsDB.deleteOne(query);

    if (deletedCount.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "An error occurred" });
  }
};
//update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productsDB.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
