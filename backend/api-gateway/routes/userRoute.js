const express = require('express');
const {
  signup,
  login,
  logout
} = require('../services/userService');

const userRouter = express.Router();

// Route to sign up new user
userRouter.post('/signup', async (req, res) => {
  try {
    const response = await signup(req.body);
    res.status(response.status).send({ message: response.data.message });
  } catch (error) {
    res.status(error.status).json({ message: error.response.data.message });
  }
});

// Route to login user
userRouter.post('/login', async (req, res) => {
  try {
    const response = await login(req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).json({ message: error.response.data.message });
  }
});

// Route to logout user
userRouter.post('/logout', async (req, res) => {
  try {
    const response = await logout(req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).json({ message: error.response.data.message });
  }
});


module.exports = userRouter;