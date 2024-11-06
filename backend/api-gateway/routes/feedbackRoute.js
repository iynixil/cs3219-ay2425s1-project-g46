const express = require('express');
const {
  addReview,
  getReview,
  addWebsiteFeedback
} = require('../services/feedbackService');

const feedbackRouter = express.Router();

feedbackRouter.post("/adduserreview", async (req, res) => {
  try {
    const response = await addReview(req.body);
    res.status(response.status).send({ message: response.data.message });
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

feedbackRouter.get("/getuserreview/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const response = await getReview(email);
    if (response.status == 204) {
      res.status(response.status).send({ message: response.data.message });
    } else if (response.status == 200) {
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    console.log(error);
    res.status(error.status).send({ error: error.response.data.error });
  }
});

feedbackRouter.post("/submitCode", async (req, res) => {
  try {
    const response = await addWebsiteFeedback(req.body);
    res.status(response.status).send({ message: response.data.message });
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

module.exports = feedbackRouter;