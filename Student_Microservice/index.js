const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const connectDB=require("./database/dbconnect");
const User=require("./models/User");

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

connectDB();

// View Own Profile
app.get("/viewprofile",async(req,res)=>{
    try{
        const {email}=req.query;

        const user=await User.findOne({email}).select("-password");

        if(!user){
            return res.status(404).json({
                message:"User Not Found"
            });
        }

        res.json(user);

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

// Update Own Profile
app.put("/updateprofile",async(req,res)=>{
    try{
        const {email,name,phone}=req.body;

        const user=await User.findOneAndUpdate(
            {email:email},
            {
                ...(name && {name:name}),
                ...(phone && {phone:phone})
            },
            {new:true}
        ).select("-password");

        if(!user){
            return res.status(404).json({
                message:"User Not Found"
            });
        }

        res.json({
            message:"Profile Updated Successfully",
            user:user
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.listen(5003,()=>{
    console.log("User Service running on port 5003");
});