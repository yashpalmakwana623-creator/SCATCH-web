const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owners-model");

if (process.env.NODE_ENV === "development") {
    router.post("/create", async function (req, res) {
        try {
            let owners = await ownerModel.find();
            
            
            if (owners.length > 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: "You don't have permission to create a new owner. Admin already exists." 
                });
            } 

            let { fullname, email, password } = req.body;

           
            if (!fullname || !email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: "All fields (fullname, email, password) are required." 
                });
            }

            let createdOwner = await ownerModel.create({
                fullname,
                email,
                password, 
            });

            res.status(201).json({ 
                success: true, 
                message: "Owner created successfully", 
                owner: createdOwner 
            });

        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
}

router.get("/admin", function (req, res) {
    res.status(200).json({ 
        success: true, 
        message: "Welcome to the Admin Panel Backend Endpoint." 
    });
});

module.exports = router;
