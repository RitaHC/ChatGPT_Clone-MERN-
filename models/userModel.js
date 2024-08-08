const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const cookie = require('cookie')

// models

// Scheme + then create a model -> Then export
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Username is Required']
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
        minlength:[6, 'Password length should be 6 character long']
    },
    customerId:{
        type:String,
        default:""
    },
    subscription:{
        type:String,
        default:""
    }
})

// hashed password
userSchema.pre('save', async function(next){
    // update
    if (!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    next()
})
// match password
userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}
// sign Token
userSchema.methods.getSignedToken = function(res){
    const accessToken = JWT.sign({id: this._id}, process.env.JWT_ACCESS_SECRET, {expiresIn: JSW_ACCESS_EXPREIN})
    const refreshToken = JWT.sign({id:this._id}, process.env.JWT_REFRESH_TOKEN, {expireIn: process.env.JST_REFRESH_EXPIREIN})
    res.cookie('refreshToken', `${refreshToken}`, {maxAge: 86400 * 7000, httpOnly: true,
    })
}
// export the schema
const User = mongoose.model('User', userSchema)

module.exports = User;