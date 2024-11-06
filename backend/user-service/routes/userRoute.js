// Author(s): Andrew, Xinyi
const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    getUser,
    updateAvatar,
    changePassword,
    getHistory
} = require("../controller/userController");

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/profile/:email", getUser);
router.post("/profile/updateavatar", updateAvatar);
router.post("/profile/changepassword", changePassword);
router.post("/profile/gethistory", getHistory);

module.exports = router;