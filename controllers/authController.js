const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
   try {
     let { email, password, fullname } = req.body;

     
     if (!email || !password || !fullname) {
         return res.status(400).json({ success: false, message: "All fields are required." });
     }

     let user = await userModel.findOne({ email: email });
     if (user) {
        return res.status(400).json({ success: false, message: "You already have an account, please login." });
     }

     bcrypt.genSalt(10, function (err, salt) {
        if (err) return res.status(500).json({ success: false, error: err.message });

        bcrypt.hash(password, salt, async function (err, hash) {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            } else {
                 let createdUser = await userModel.create({
                    email,
                    password: hash,
                    fullname
                });

               
                let token = generateToken(createdUser);
                res.cookie("token", token, { httpOnly: true, secure: true }); 
                
                
                return res.status(201).json({ 
                    success: true, 
                    message: "User created successfully",
                    user: { id: createdUser._id, email: createdUser.email, fullname: createdUser.fullname }
                });  
            }
        });
     });
   } catch (err) {
      res.status(500).json({ success: false, error: err.message });
   }
};

module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Email or Password incorrect" });
        }

    
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) return res.status(500).json({ success: false, error: err.message });

            if (result) {
                let token = generateToken(user);
                res.cookie("token", token, { httpOnly: true, secure: true });
                
                return res.status(200).json({ 
                    success: true, 
                    message: "Login successful",
                    user: { id: user._id, email: user.email, fullname: user.fullname }
                });
            } else {
                return res.status(401).json({ success: false, message: "Email or Password incorrect" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


module.exports.logout = function (req, res) {
    
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    
    return res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
    });
};
