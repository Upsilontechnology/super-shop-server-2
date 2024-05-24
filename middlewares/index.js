const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");

const applyMiddleware = (app) => {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5173"],
      credentials: true,
      optionSuccessStatus: 200,
    })
  );



  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'welcome to our server!'
    })
  })
};

module.exports = applyMiddleware;





