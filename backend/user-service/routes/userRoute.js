// Author(s): Andrew, Xinyi
const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    getUser,
    getReview
} = require("../controller/userController");

const { 

} = require("../controller/feedbackController");

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/profile/:email", getUser);
router.get("/review/:email", getReview);

module.exports = router;