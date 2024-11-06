// Author(s): Xiu Jia
const express = require("express");

const apiRouter = express.Router();

const userRoute = require("./userRoute");
const questionRoute = require("./questionRoute");
const collaborationRoute = require("./collaborationRoute");
const feedbackRoute = require("./feedbackRoute");

apiRouter.use("/user", userRoute);
apiRouter.use("/question", questionRoute);
apiRouter.use("/collaboration", collaborationRoute);
apiRouter.use("/feedback", feedbackRoute);

module.exports = apiRouter;