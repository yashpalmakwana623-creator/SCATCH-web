const express = require('express');
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require('../models/product-model');

router.get("/", function(req, res) {
   res.status(200).json({ success: true, message: "Welcome to the E-Commerce API Backend" });
});


router.get("/shop", isLoggedin, async function(req, res){
     try {
        let products = await productModel.find();
        res.status(200).json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


router.get("/logout", isLoggedin, function(req, res){
    try {
        res.cookie("token", "", { expires: new Date(0), httpOnly: true });
        res.status(200).json({ success: true, message: "Session cleared and logged out successfully." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
