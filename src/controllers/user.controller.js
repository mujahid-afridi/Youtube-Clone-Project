 import asyncHandler from '../utils/asynchandler.js'
import {ApiError} from "../utils/ApiError.js"
import { User } from '../models/user.models.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"


const registerUser = asyncHandler( async (req , res)=>{
    // get user detail from frontend
    // validation -not empty
    // check if user alreday exist- username and email
    // check for images and avatar
    // upload them to cloudinary, avatar
    // create user object and create entry in db
    // remove password and refresh token from from response
    // check for user creation
    // return res

    const {userName, email, fullName, password} = req.body

    //Test case
    if([userName, email, fullName, password].some((field)=> field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existUser = await User.findOne(
        {
            $or : [{userName},{email}]
        }
    )
    if(existUser){
        throw new ApiError(409, "User already exist")
    }

    let coverImageLocalPath;
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req?.files?.coverImage[0]?.path
    }
    

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    let avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage = await  uploadOnCloudinary(coverImageLocalPath)
    

    console.log("Avatar = ",avatar)
    if(!avatar){
        throw new ApiError(400, "First Avatar file is required")
    }


    let user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "", 
        email,
        password,
        userName,
    })


    let createdUser =await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
} )


const generateAccessAndRefreshToken =async (userId) =>{
    try{
        const user =await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "something went wrong while creating access or refresh token")
    }
}


const loginUser = asyncHandler(async (req, res)=>{
    // get user credential from user
    // validate
    // if credential match in db then logged in user
    // if wrond credential then show error


    const {userName , email, password} = req.body


    if(!userName || !email){
        throw new ApiError(400, "username and email is required")
    }

    let user = await User.findOne(
        {
            $or : [{email}, {userName}]
        }
    )

    if(!user){
        throw new ApiError(404, "User not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, "Pasword is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser =await User.findById(user._id).select("-password -refreshToken")
    console.log("LoggedInUser = ",loggedInUser)

    //cookies only modiefied by server
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const refreshAccessToken = asyncHandler( async (req, res)=>{
    const incommingRefreshToken = resreq.cookies.refreshToken || req.body.refreshToken
    console.log("incommingRefreshToken = ", incommingRefreshToken)

    if(!incommingRefreshToken){
        throw new ApiError(401, "Unauthorized access")
    }

    try {
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log("decodedToken = ", decodedToken)
    
        const user = await User.findById(decodedToken._id)
        console.log("user = ",user)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incommingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly : true,
            secure : true,
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token")
    }
})

const logoutUser = asyncHandler(async (req, res)=>{
   await User.findByIdAndUpdate(
     req.user._id,
     {
        refreshToken : undefined
     },
     {
        new : true
     }
   )

   const options = {
    httpOnly : true,
    secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(
        new ApiResponse(200, {},"User logged out")
    )
})


export {
    registerUser, 
    loginUser, 
    logoutUser,
    refreshAccessToken
}