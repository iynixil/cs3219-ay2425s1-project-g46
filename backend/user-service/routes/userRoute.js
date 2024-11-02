// Author(s): Andrew, Xinyi
const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    getUser,
    getReview,
    updateAvatar
} = require("../controller/userController");

const { 
    addReview,
    addWebsiteFeedback
} = require("../controller/feedbackController");

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/profile/:email", getUser);
router.post("/profile/updateavatar", updateAvatar);
router.get("/review/:email", getReview);
router.post("/review/addreview", addReview);
router.post("/feedback/addwebsitefeedback", addWebsiteFeedback);

module.exports = router;