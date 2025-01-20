//this middleware is created by me and it verify wether user is logInned or not.
// As is app.js we defined cookies and we were able to use it in user.controllers.js similarly we define our own middleware to use it later when req. like while logOut user and another purpose

import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

// when we write middleware we need req, res, next and error . next give access to take it where it required.
export const verifyJWT = asyncHandler(async(req, _, next) =>{
    // now we need to get accessToken but how ? Actually we have access of req and it has cookies 
    // If check if we have cookies or not using ? 
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") // now we have accessToken wether from cookies or header
        if(!token){
            throw new ApiError(401, "Unauthriozed request")
        }
    
        // jwt verify token as token is incoded so we need to get secret key from env variable 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user =  await User.findById(decodedToken?._id).select("-password -refreshToken") // jhere we get userid from decodedToken and remove password and refreshToken and save in a var user
        if (!user){
            throw new ApiError(401, "invalid Access Token")
        }
    
        // we have user then you are thinking we should return but it's not true
        // Actually we have req. access so we add new object by any name
    
        req.user = user; // adding new object to user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access Token")
    }
})