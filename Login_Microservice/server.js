const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");

const User = require("./models/User");
const connectDB = require("./database/dbconnect");


dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());


connectDB();



const loginUser = async(req,res)=>{

    try{

        const {
            email,
            password,
            role
        } = req.body;
        // Find user
        const user = await User.findOne({email});
        if(!user){

            return res.status(404).json({
                message:"Invalid Email"
            });

        }
        // Check Role
        if(user.role !== role){

            return res.status(401).json({
                message:"Invalid Role"
            });

        }
        // Compare Password
        const match = await bcrypt.compare(
            password,
            user.password
        );


        if(!match){

            return res.status(401).json({
                message:"Invalid Password"
            });

        }
        // Create JWT
        const token = jwt.sign(
            {
                id:user._id,
                role:user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"1h"
            }
        );



        res.json({

            message:"Login Successful",
            token:token

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};

app.post("/auth/login", loginUser);
app.post("/login", loginUser);

app.listen(5002,()=>{

console.log("Login Service running on port 5002");

});
