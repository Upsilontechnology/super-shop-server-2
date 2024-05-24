const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");

const applyMiddleware = (app) => {
  app.use(
    cors({
      origin: ["https://supershop.abmgloballtd.com", "https://supershop.abmgloballtd.com"],
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





