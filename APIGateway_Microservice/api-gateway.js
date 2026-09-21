const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const {
    createProxyMiddleware,
    fixRequestBody
}=require("http-proxy-middleware");

dotenv.config();

const app=express();

app.use(cors());


// Registration Service
app.use("/register",
createProxyMiddleware({
    target:"http://localhost:5001",
    changeOrigin:true,

    pathRewrite:{
        "^/register/userregister":"/register",
        "^/register":"/register",
    }
})
);


// Authentication Service
app.use("/auth",
createProxyMiddleware({
    target:"http://localhost:5002",
    changeOrigin:true,
    pathRewrite:{
        "^/auth/login":"/auth/login",
        "^/auth":"/auth"
    }
}));


app.use(express.json());


// JWT Verification
const verifyToken=(req,res,next)=>{

    const authHeader=req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message:"No token provided"
        });
    }

    const token=authHeader.split(" ")[1];

    try{

        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user=decoded;
        next();

    }catch(error){

        return res.status(401).json({
            message:"Invalid token"
        });

    }
};


// Role Check
const checkRole = (role)=>{

    return (req,res,next)=>{

        const userRole = String(req.user.role || "").trim().toLowerCase();
        const requiredRole = String(role).trim().toLowerCase();

        if(userRole !== requiredRole){

            return res.status(403).json({
                message:"Access denied",
                requiredRole,
                tokenRole:userRole || null
            });

        }

        next();

    };

};
// Admin Service
app.use("/admin",
verifyToken,
checkRole("admin"),
createProxyMiddleware({
    target:"http://52.207.23.225:5004",
    changeOrigin:true,
    on:{
        proxyReq:fixRequestBody
    },
    pathRewrite:{
        "^/admin":"/admin"
    }
})
);
// User Service
app.use("/user",
verifyToken,
checkRole("user"),
createProxyMiddleware({
    target:"http://54.221.162.139:5003",
    changeOrigin:true,
    on:{
        proxyReq:fixRequestBody
    },
    pathRewrite:{
        "^/user":"/user"
    }
})
);


app.listen(3000,()=>{
    console.log("API Gateway running on port 3000");
});
