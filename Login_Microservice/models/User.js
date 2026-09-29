const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({

    name:{
        type:String
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        required:true
    },

    phone:{
        type:String
    }

},
{
    timestamps:true
});


module.exports = mongoose.model("User",UserSchema);