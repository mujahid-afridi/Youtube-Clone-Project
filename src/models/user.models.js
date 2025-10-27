import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    id : {
        typeof : String,
        required : true,
        unique : true,
        index : true
    },
    watchHistory : [
        {
            typeof : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    userName : {
        typeof : String,
        lowercase : true,
        required : true,
        unique : true,
        index : true,
        trim : true
    },
    email : {
        typeof : String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true
    },
    fullName : {
        typeof : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        typeof : String, //cloudinary url
        required : true
    },
    coverImage : {
        typeof : String, 
    },
    password : {
        typeof : String,
        required : [true, 'Password required'],
    },
    refreshToken : {
        typeof : String
    }
}, {timestamps : true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next()
} )

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function() {
    jwt.sign(
        {
            _id : this._id,
            email : this.email,
            userName : this.userName,
            fullName : this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function() {
    jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model('User', userSchema)