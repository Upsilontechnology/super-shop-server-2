const mongoose = require("mongoose");

const sellProductSchema = mongoose.Schema({
  productName: {
    type: String,
    require: true,
  },
  productCode: {
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
  price: {
    type: Number,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
  sellingDate: {
    type: Date,
  },
  email: {
    type: String,
    require: true,
  },
  branch: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
});

module.exports = sellProductSchema;
