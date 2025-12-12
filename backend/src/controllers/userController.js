const User = require('../models/usersModel.js')
const Errorhandler = require('../utils/errorhander.js')
const catchAsyncError = require('../../src/middleware/catchAsyncErrors.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendToken = require('../utils/jwtToken.js')
const sendMail = require('../utils/sendMail.js')
const crypto = require('crypto')
const ApiFeatures = require('../utils/apiFeatures.js')

// creating a user --> Register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, username, email, password, phone, address, avatar, role } = req.body;

    if (!["user", "editor"].includes(role)) {
        return next(new Errorhandler("Role should be either 'user' or 'editor'", 402));
    }

    if(!name || !username || !email || !password || !phone || !address){
        return next( new Errorhandler("Please fill required fields !", 402));
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!usernameRegex.test(username)) {
        return next( new Errorhandler( "Username can only contain letters, numbers, and underscore (no spaces or special characters).", 400 ));
    }

    const existing = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email: email.toLowerCase() },
            { phone }
        ]
    });

    if (existing) {
        if (existing.username === username.toLowerCase()) {
            return next(new Errorhandler("Username already taken!", 400));
        }
        if (existing.email === email.toLowerCase()) {
            return next(new Errorhandler("Email already registered!", 400));
        }
        if (existing.phone === phone) {
            return next(new Errorhandler("Phone number already registered!", 400));
        }
    }

    let user = await User.create({
        name,
        username,
        email,
        password,
        phone,
        address,
        avatar: avatar || "sampleurl",
        role,
    });

    sendToken(user, 201, res);
});


// user login
exports.loginUser = catchAsyncError(async(req,res,next)=>{

    const{email,password} = req.body;

    if(!email || !password){  // if entered empty email or password
        return next(new Errorhandler("Please Enter Email or Password",400))
    }
    let user = await User.findOne({email}).select("+password");
  
    if(!user){    // if user not found with this mail
        return next(new Errorhandler("Invalid Email Or Password !!!",401));
    }

    const passwordComp = await bcrypt.compare(password,user.password);
    if(!passwordComp){     // if password does not matches
        return next(new Errorhandler("Invalid Email Or Password !!!",401))
    }
    sendToken(user,200,res);   // generates and saves token in cookies
})

// user logout -->
exports.logout = catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success:true,
        message:"Logged Out Succeccfully"
    })
})

// forgot password -->
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{

    const email = req.body.email;
    const user =  await User.findOne({email});

    if(!user){
        return next(new Errorhandler("User Not Found",404));
    }

    //get resetPassword token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password reset token is :\n ${resetPasswordUrl}\n\nIf you have not requested this email please ignore it !!`

    try {
        // function call
        await sendMail({email:user.email,subject:"Ecom Password Recovery",message });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    } catch (error) {  // if some error occurs chang database reset token to undefine
        user.resetPasswordToken = undefined;
        user.resetPasswordExpired = undefined;
        await user.save({validateBeforeSave:false});

        return(next(new Errorhandler(error.message,500)))
    }
})

// reset password -->
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    //creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await User.findOne({resetPasswordToken:resetPasswordToken});

    if(!user){
        return next(new Errorhandler("Reset Password Token is invalid or has Expired",400));
    }

    const {password,confirmPassword} = req.body;

    if(password !== confirmPassword){
        return next(new Errorhandler("Password does not match !!",400));
    }
    
    user.password = password;  // password changed 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save();

    sendToken(user,200,res);
})

// get user details
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})

// update user password -->
exports.updatePassword = catchAsyncError(async(req,res,next)=>{

    const{oldPassword,newPassword} = req.body;

    //finding the login user details
    const user = await User.findById(req.user.id).select('+password');

    //comparing password entered -->
    const passComp = await bcrypt.compare(oldPassword,user.password);
    if(!passComp){
        return next(new Errorhandler("Old Password Entered is Incorrect",400));
    }

    user.password = newPassword;
    await user.save();

    sendToken(user,200,res)
})

// update user profile except password -->
exports.updateProfile = catchAsyncError(async(req,res,next)=>{

    const newUser = {
        name:req.body.name,
        address:req.body.address,
        phone:req.body.phone,
    }
    await User.findByIdAndUpdate(req.user.id,newUser,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        message:"Profile Updated Successfully"
    })
})

// Admin routes below --->>

// get all users (admin) -->
exports.getAllUser = catchAsyncError(async(req,res,next)=>{

    const resultPerPage = req?.query?.limit || 20;
    const currentPage = Number(req.query.page) || 1;

    const apiFeaturesForCount = new ApiFeatures(User.find({role:"user"}), req.query)
        .search()
        .filter();

    const totalCount = await apiFeaturesForCount.query.clone().countDocuments();

    const apiFeatures = new ApiFeatures(User.find({role:"user"}),req.query)
    .search() 
    .pagination(resultPerPage);

    const users = await apiFeatures.query;
    const totalPages = Math.ceil(totalCount / resultPerPage);


    res.status(200).json({
        success:true,
        totalResult:totalCount,
        users,
        totalPages,
        currentPage,
        hasMore: currentPage < totalPages
    })
})
exports.getAllEditor = catchAsyncError(async(req,res,next)=>{

    const resultPerPage = req?.query?.limit || 20;
    const currentPage = Number(req.query.page) || 1;
    console.log(req.query)

    const apiFeaturesForCount = new ApiFeatures(User.find({role:"editor"}), req.query)
        .search()
        .filter();

    const totalCount = await apiFeaturesForCount.query.clone().countDocuments();

    const apiFeatures = new ApiFeatures(User.find({role:"editor"}),req.query)
    .search() 
    .pagination(resultPerPage);

    const users = await apiFeatures.query;
    const totalPages = Math.ceil(totalCount / resultPerPage);


    res.status(200).json({
        success:true,
        totalResult:totalCount,
        users,
        totalPages,
        currentPage,
        hasMore: currentPage < totalPages
    })
})

// get single user Details(admin) -->
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`User does not exists with id ${req.params.id}`,404))
    }
    res.status(200).json({
        success:true,
        user
    })
})

// update user role,profile and password - Admin -->
exports.updateUserRole = catchAsyncError(async (req, res, next) => {

    const { name, role, phone, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new Errorhandler(`User does not exist with id ${req.params.id}`, 404));
    }

    // Update user fields dynamically
    if (name) user.name = name;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (password) user.password = password;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
    });
});

// Delete user - Admin -->
exports.deleteUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`User does not exists with id ${req.params.id}`,404))
    }
    await User.findByIdAndDelete(user.id)
    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
})

// toggle follow / unfollow a user
exports.followUser = catchAsyncError(async (req, res, next) => {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;
  
    // prevent following self
    if (targetUserId === currentUserId) {
      return next(new Errorhandler("You cannot follow yourself", 400));
    }
  
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
  
    if (!targetUser) {
      return next(new Errorhandler("Target user not found", 404));
    }
    if (!currentUser) {
      return next(new Errorhandler("Current user not found", 404));
    }
  
    // check if already following
    const isFollowing = currentUser.following.some(
      (f) => f.user.toString() === targetUserId.toString()
    );
  
    if (isFollowing) {
      // unfollow: remove from both sides
      currentUser.following = currentUser.following.filter(
        (f) => f.user.toString() !== targetUserId.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (f) => f.user.toString() !== currentUserId.toString()
      );
  
      await currentUser.save();
      await targetUser.save();
  
      return res.status(200).json({
        success: true,
        message: "User unfollowed",
        followersCount: targetUser.followers.length,
        followingCount: currentUser.following.length,
      });
    } else {
      // follow: add to both sides
      currentUser.following.push({ user: targetUserId, followedAt: Date.now() });
      targetUser.followers.push({ user: currentUserId, followedAt: Date.now() });
  
      await currentUser.save();
      await targetUser.save();
  
      return res.status(200).json({
        success: true,
        message: "User followed",
        followersCount: targetUser.followers.length,
        followingCount: currentUser.following.length,
      });
    }
  });
  