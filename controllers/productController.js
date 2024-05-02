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

exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new Object(id) };
  try {
    const result = await productsDB.find(query);
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
//     } else {
//       return res.status(400).json({ message: "Invalid user" });
//     }

//     if (searchValue && searchValue.trim() !== "") {
//       query.$or = [{ productCode: searchValue }, { category: searchValue }];
//     }

//     if (status) {
//       query.status = status;
//     }
//     if (branch) {
//       query.branch = branch;
//     }

//     const skip = currentPage * itemsPerPage;

//     const projection = {
//       _id: 0,
//       productCode: 1,
//       category: 1,
//       deliveryDate: 1,
//       status: 1,
//       branch: 1,
//     };

//     const items = await productsDB
//       .find(query, projection)
//       .skip(skip)
//       .limit(itemsPerPage)
//       .sort({ deliveryDate: -1 });

//     if (!items || items.length === 0) {
//       return res.status(404).json({
//         message: "No items found for the given email and search term",
//       });
//     }
//     const totalCount = await productsDB.countDocuments(query);
//     res.status(200).json({ items, totalCount });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Error occurred while searching for items",
//     });
//   }
// };

exports.getProductSearch = async (req, res) => {
  try {
    const {
      email,
      searchValue,
      role,
      currentPage,
      itemsPerPage,
      status,
      branch,
    } = req.query;

    if (!["Employee", "Admin"].includes(role)) {
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
      // console.log(email);
    }

    if (searchValue && searchValue.trim() !== "") {
      query.$or = [
        { category: searchValue.trim() },
        { productCode: parseInt(searchValue.trim()) || 0 },
      ];
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
      productsDB
        .find(query)
        .skip(skip)
        .limit(parseInt(itemsPerPage))
        .sort({ deliveryDate: -1 }),
      productsDB.countDocuments(query),
    ]);

    // if (items.length === 0) {
    //   return res.status(404).json({
    //     message: "No items found for the given email and search term",
    //   });
    // }

    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while searching for items" });
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
    const query = { productCode: data?.productCode };
    const existingProductCode = await productsDB.findOne(query);
    if (existingProductCode) {
      return res.json({ message: "Product Code has alredy taken" });
    }
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
    const { id } = req.params;
    const query = { _id: new Object(id) };

    const result = await productsDB.deleteOne(query);
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
//update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const updatedProduct = await productsDB.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Products not found" });
    } else {
      // res.json(updatedProduct);
      res.status(200).json({
        message: "success",
      });
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.getProductStatistics = async (req, res) => {
//   try {
//     const { role, email } = req.query;
//     let query = {};
//     console.log(role, email);
//     if (role === "Admin") {
//       query = { branch: req.query.branch };
//     } else if (role === "Employee") {
//       if (!email) {
//         return res
//           .status(400)
//           .json({ message: "Missing email for employee role" });
//       }
//       query = { email, branch: req.query.branch };
//     } else {
//       return res.status(400).json({ message: "Invalid user role" });
//     }

//     const statistics = await productsDB.aggregate([
//       { $match: query },
//       {
//         $group: {
//           _id: null,
//           totalQuantity: { $sum: "$quantity" },
//           totalSellAmount: { $sum: "$sellprice" },
//           totalPurchaseAmount: { $sum: "$purchaseprice" },
//           totalCategories: { $addToSet: "$category" },
//         },
//       },
//       {
//         $project: {
//           totalProducts: "$totalQuantity",
//           totalSellAmount: 1,
//           totalPurchaseAmount: 1,
//           totalCategories: { $size: "$totalCategories" },
//         },
//       },
//     ]);

//     const result =
//       statistics.length > 0
//         ? statistics[0]
//         : {
//             totalProducts: 0,
//             totalSellAmount: 0,
//             totalPurchaseAmount: 0,
//             totalCategories: 0,
//           };

//     res.status(200).json(result);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Error occurred while fetching product statistics" });
//   }
// };

exports.getProductStatistics = async (req, res) => {
  try {
    const { role, email } = req.query;
    let query = {};
    // console.log(role, email);
    if (role === "Admin") {
      query = { branch: req.query.branch };
    } else if (role === "Employee") {
      if (!email) {
        return res
          .status(400)
          .json({ message: "Missing email for employee role" });
      }
      query = { email, branch: req.query.branch };
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    const statistics = await productsDB.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalSellAmount: { $sum: "$sellprice" },
          totalPurchaseAmount: { $sum: "$purchaseprice" },
        },
      },
      {
        $project: {
          totalProducts: "$totalQuantity",
          totalSellAmount: 1,
          totalPurchaseAmount: 1,
        },
      },
    ]);

    const allCategories = await productsDB.distinct("category");

    const result =
      statistics.length > 0
        ? statistics[0]
        : {
            totalProducts: 0,
            totalSellAmount: 0,
            totalPurchaseAmount: 0,
          };

    result.allCategories = allCategories.length;

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching product statistics" });
  }
};

// exports.updateSoldProducts = async (req, res) => {
//   const { items } = req.body;
//   for (const item of items) {
//     const { code, quantity } = item;
//     const product = await SellProduct.findOne({ productCode: code });
//     const newQuantity = product?.quantity - quantity;
//     const filter = { productCode: code };
//     const updatedDoc = { quantity: newQuantity };
//     await SellProduct.updateOne(filter, updatedDoc);
//   }
// };

exports.updateSoldProducts = async (req, res) => {
  try {
    const { items } = req.body;
    // console.log(items);

    const negativeQuantity = items.some((item) => item.quantity < 0);
    if (negativeQuantity) {
      return res
        .status(400)
        .json({ message: "Negative quantity is not allowed" });
    }

    const productCodes = items.map((item) => item.code);
    const quantities = items.map((item) => item.quantity);

    const products = await productsDB.find({
      productCode: { $in: productCodes },
    });

    const invalidQuantities = products.some((product, index) => {
      return quantities[index] > product.quantity;
    });

    if (invalidQuantities) {
      return res.status(400).json({
        message: "Updated quantity cannot be greater than main quantity",
      });
    }

    // Perform the bulk write operation to update quantities
    const bulkOperations = products.map((product, index) => ({
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { quantity: -quantities[index] } },
      },
    }));
    await productsDB.bulkWrite(bulkOperations);

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error updating sold products:", error);
    res
      .status(500)
      .json({ message: "Error occurred while updating sold products" });
  }
};
