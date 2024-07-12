const express = require("express");
const User = require("../models/userModel");

const router = express.Router();
const bcrypt = require("bcrypt");


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
        if(user){
            const validPassword = await bcrypt.compare(req.body.password, user.password);   
            if(validPassword){
                res.send({
                    success:true,
                    message:"User has been logged in successfully"
                })
                
            }
            else{
                res.send({
                    success:false,
                    message:"Invalid Password"
                })
                
            }
        }
        else{
            res.send({
                success:false,
                message:"User not found, Register first"
            })
            
        }
        

    }
    catch(error){
        res.send({
            success:false,
            message:"User Login Failed, Please try again later"
        
        })
        console.log(error)
    }
  
});


module.exports = router;