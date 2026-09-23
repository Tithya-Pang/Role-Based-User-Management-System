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


const viewAllUsers = async(req,res)=>{

    try{

        const users=await User.find();

        res.json(users);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

app.get("/admin/viewalluser", viewAllUsers);
app.get("/viewalluser", viewAllUsers);


const searchUser = async(req,res)=>{

    try{

        const {email,name}=req.query;

        const user=await User.findOne({
            $or:[
                {email:email},
                {name:name}
            ]
        });


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

};

app.get("/admin/searchuser", searchUser);
app.get("/searchuser", searchUser);

const deleteUser = async(req,res)=>{

    try{

        const {email}=req.body;

        const user=await User.findOneAndDelete({
            email:email
        });


        if(!user){

            return res.status(404).json({
                message:"User Not Found"
            });

        }


        res.json({
            message:"User Deleted Successfully"
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

app.delete("/admin/deluser", deleteUser);
app.delete("/deluser", deleteUser);

app.listen(5004,()=>{
    console.log("Admin Service running on port 5004");
});
