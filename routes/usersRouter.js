// const express = require('express');
// const router = express.Router();
// const isLoggedin = require("../middlewares/isLoggedin");
// const { registerUser, loginUser, logout } = require("../controllers/authController");

// router.get("/", function (req, res) {
//     res.status(200).json({ 
//         success: true, 
//         message: "User Authentication API Gateway is active." 
//     });
// });

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logout);

// module.exports = router;




// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



const express = require('express');
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const { registerUser, loginUser, logout } = require("../controllers/authController");

const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

router.get("/", function (req, res) {
    res.status(200).json({ 
        success: true, 
        message: "User Authentication API Gateway is active." 
    });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);


router.post("/cart/add/:productId", isLoggedin, async function(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let productId = req.params.productId;

        
        let product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

       
        user.cart.push(productId);
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Product added to cart successfully", 
            cartLength: user.cart.length 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get("/cart", isLoggedin, async function(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        
        let cartItems = await productModel.find({ _id: { $in: user.cart } });

        res.status(200).json({ 
            success: true, 
            cartCount: user.cart.length,
            cart: cartItems 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
