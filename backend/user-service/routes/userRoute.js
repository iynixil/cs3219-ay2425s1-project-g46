// Author(s): Andrew, Xinyi
const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    getUser,
    updateAvatar
} = require("../controller/userController");

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/profile/:email", getUser);
router.post("/profile/updateavatar", updateAvatar);

module.exports = router;