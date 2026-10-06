const express = require('express');
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const { registerUser, loginUser, logout } = require("../controllers/authController");

router.get("/", function (req, res) {
    res.status(200).json({ 
        success: true, 
        message: "User Authentication API Gateway is active." 
    });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

module.exports = router;
