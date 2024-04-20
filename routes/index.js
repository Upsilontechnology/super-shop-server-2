// const router = require("express").Router();

const authRoute = require("./authRoutes");
const categoryRoute = require("./categoryRoutes");
const userRoute = require("./userRoutes");

module.exports = { categoryRoute, authRoute, userRoute };
