// Author(s): Xiu Jia
const express = require("express");

const apiRouter = express.Router();

const userRoute = require("./userRoute");
const questionRoute = require("./questionRoute");

apiRouter.use("/user", userRoute);
apiRouter.use("/question", questionRoute);

module.exports = apiRouter;