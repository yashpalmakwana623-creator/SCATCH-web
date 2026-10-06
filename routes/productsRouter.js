const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async function (req, res) {
    try { 
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a product image" });
        }

        let product = await productModel.create({
            image: req.file.buffer, 
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });

        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;

