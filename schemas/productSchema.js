const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    require: true,
  },
  productCode: {
    type: Number,
    require: true,
  },
  unit: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  purchaseprice: {
    type: Number,
    require: true,
  },
  sellprice: {
    type: Number,
    require: true,
  },
  supplierName: {
    type: String,
    require: true,
  },
  sellingDate: {
    type: Date,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  branchName: {
    type: String,
    require: true,
  },
});

module.exports = productSchema;
