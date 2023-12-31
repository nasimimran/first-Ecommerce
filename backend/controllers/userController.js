const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtTolen");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');

// Register a User
exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const {name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicUrl",
        },
    });
    sendToken(user,201,res);

});

// Login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const {email, password} = req.body;

    // checking user has given password and email both

    if (!email || !password) {
        return next(new ErrorHandler("please provide a valid email & password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password",401));
    }
   sendToken(user,200,res);

});

// Logod user
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, { 
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "logged out"
    });
});


// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user){
        return next(new ErrorHandler("User not found",404));
    }

    // get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password reset Token is : \n\n ${resetPasswordUrl}\n\n If you have not requested reset password please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message: message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next (new ErrorHandler(error.message,500));
    }
});

// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    });

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired",404));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not confirmed",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get user details
exports.getUserDetails = catchAsyncError ( async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// update user password
exports.updatePassword = catchAsyncError ( async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect",400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// update user profile
exports.updateProfile = catchAsyncError ( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    // we will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});

// Get all the users --admin
exports.getAllUser = catchAsyncError ( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
}); 

// Get single user --admin
exports.getSingleUser = catchAsyncError ( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User dose not exist with Id: ${req.params.id}`,404)
        );
    }
    
    res.status(200).json({
        success: true,
        user
    });
}); 

// update user Role --admin
exports.updateUserRole = catchAsyncError ( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User dose not exist with Id: ${req.params.id}`,404)
        );
    }

    await user.updateOne(newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});

// delete user  --admin
exports.deleteUser = catchAsyncError ( async (req, res, next) => {

    const user = await User.findById(req.params.id);
   
    // we will remove cloudinary later

    if (!user) {
        return next(
            new ErrorHandler(`User dose not exist with Id: ${req.params.id}`,404)
        );
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});