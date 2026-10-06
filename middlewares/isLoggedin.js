
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function(req, res, next) {
    
    if (!req.cookies || !req.cookies.token) {
        return res.status(401).json({ success: false, message: "Unauthorized: You need to login first" });
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel
            .findOne({ email: decoded.email })
            .select("-password"); 
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user; 
        next(); 

    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

