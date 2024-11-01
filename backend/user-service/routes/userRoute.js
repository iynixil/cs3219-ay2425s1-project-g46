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
    addReview
} = require("../controller/feedbackController");

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/profile/:email", getUser);
router.get("/review/:email", getReview);
router.post("/review/addreview", addReview);

module.exports = router;