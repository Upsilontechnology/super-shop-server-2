const express = require("express");
const mongoose = require("mongoose");
const globalErrorHandler = require("./utils/globalErrorHandler");
// const routes = require("./routes");
const applyMiddleware = require("./middlewares");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productsRoutes = require("./routes/productsRoutes");
const sellRoutes = require("./routes/sellRoutes");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
require("colors");
applyMiddleware(app);

mongoose
  .connect(process.env.URI)
  .then(() => console.log("DB Connected Successful"))
  .catch((err) => console.log(err));

// app.use(routes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sellProducts", sellRoutes);
// /products/search
app.use(globalErrorHandler);

app.get("/health", (req, res) => {
  res.send("SuperShop. Alamgir Running Successfully");
});

app.all("*", (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on the server`);
  error.status = 404;
  next(error);
});

app.listen(port, (req, res) => {
  console.log(`SuperShop are running on: ${port}`.blue.bold);
});
