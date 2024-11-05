// Author(s): Xiu Jia
const express = require("express");

const apiRouter = express.Router();

const userRoute = require("./userRoute");

apiRouter.use("/user", userRoute);

module.exports = apiRouter;