const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./database/dbconnect");
const User = require("./models/User");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone
        } = req.body;

        // Check existing email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone
        });

        await newUser.save();

        res.status(201).json({
            message: "User Registered Successfully",
            user: newUser
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Register API
app.post("/register", registerUser);
app.post("/userregister", registerUser);

app.listen(5001, () => {
    console.log("Registration Service running on port 5001");
});
