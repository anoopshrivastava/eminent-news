const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UsersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter Your Name"],
        minLength:[4,"Name should be atleast 4 characters"],
        maxLength:[30,"Name should not exceed 30 characters"],
    },
    username:{
        type:String,
        required:[true,"Enter Your Username"],
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[a-zA-Z0-9_]+$/, 
    },
    email:{
        type:String,
        required:[true,"Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Enter Your Password"],
        minLength:[6,"Password should be atleast 6 characters"],
        select:false,

    },
    avatar:{
        type:String
    },
    bio:{
        type:String
    },
    location:{
        type:String
    },
    role:{
        type: String,
        enum: ["user", "editor", "admin"],
        default:"user"
    },
    address: {
        type: String
    },
    phone: { 
        type: String 
    },
    verified:{
        type: Boolean,
        default: false,
    },
    twitterLink:{
        type: String
    },
    youtubeLink:{
        type: String
    },
    linkedInLink:{
        type: String
    },
    followers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            followedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    following: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            followedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    resetPasswordToken:String,
    resetPasswordExpired:Date,

},{timestamps:true})

UsersSchema.pre("save",async function(next){

    if(!this.isModified("password")){  // if users updates its profile and just change name and email and doesnt modify pasword then we dont have to hash password again
        next();
    }

    //password hashing
    this.password = await bcrypt.hash(this.password,10);
})

// Jwt token --> so that user gets logged in directly after register 
UsersSchema.methods.getJWTtoken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

// for resetting password
UsersSchema.methods.getResetPasswordToken = function(){

    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    this.resetPasswordExpired = Date.now * 15 * 60 * 1000;
    return resetToken;
}
module.exports = mongoose.model('User',UsersSchema);