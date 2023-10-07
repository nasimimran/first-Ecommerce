const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Name"],
        trim: true,
        maxLength: [30, "Name connot exceed 30 characters"],
        minLength: [3, "Name should have more than 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter ypur email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    
    resetePasswordToken: String,
    resetePasswordExpire: Date,
});

userSchema.pre('save', async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password,10);

});

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model("User", userSchema);