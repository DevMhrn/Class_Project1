const express = require("express");
const User = require("../models/userModel");

const router = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");





router.post("/register", async (req, res) => {
    try{
        const user = await User.findOne({email : req.body.email});
        console.log(user)
        if(user){
            console.log("User Already Exists")

            res.send({
                success:false,
                message:"User Already Exists"
            })

            // res.status(500).json({message : "User Already Exists"})
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;

            const newUser = new User(req.body);
            await newUser.save();
            console.log("User Registered Successfully")
            res.send({
                success:true,
                message:"User has been registered successfully"
            })
            
        }

    }
    catch(error){
        res.send({
            success:false,
            message:"User Registration Failed, Please try again later"
        
        })
        
        console.log(error)
    }


});

router.post("/login", async (req, res) => {

    try{
        const user = await User.findOne({email : req.body.email});
        console.log(user);
    
        if(!user){
            res.send({
                success:false,
                message:"User not found, Register first"
            })
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            res.send({
                success:false,
                message:"Invalid Password"
            })
        }
        const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET);
        // localStorage.setItem("token", token);
        res.send({
            success:true,
            message:"User has been logged in successfully",
            token:token,

            
        });


        

    }
    catch(error){
        res.send({
            success:false,
            message:"User Login Failed, Please try again later"
        
        })
        console.log(error)
    }
  
});

router.get('/profile',authMiddleware, async (req, res) => {  
    try{
        const user  = await User.findById(req.body.userId).select("-password");
        res.send({
            success:true,
            user:user,
            message:"Authorized User"
        })
    } 
    catch(error){
        res.send({
            success:false,
            message:"User is not authenticated"
        })
    }
    

});





module.exports = router;