import { asyncHandler } from "../utils/asyncHandler.js"; // imported asyncHandler.js file
import {ApiError} from "../utils/ApiErrors.js"

import {User} from "../models/user.models.js"

import {uploadOnCloudinary} from "../utils/cloudinary.js"

import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req , res) =>{
    // => we have to think and breakdown steps while registering user.
    /* Jab koi user register karta hai to ye cheez req hoti hai
    Username , email , password 
    ye saare details ko hame save karne hain and jab req ho to use call karna hai
    Step:1 Get user details from frontend
    Step:2 Validation not empty , check any details is not null or empty 
    Step:3 check if user already exist : username , email
    Step:4 check for image , check for avatar 
    Step:5 upload them to cloudinary and check upload status ,call avatar
    Step:6 Create user object because MongoDb is nosql , create entry in db
    Step:7 remove password and refresh token field form response
    Step:8 check for user creation
    Return Response

    */
// 1.jab bhi data body ya json se aata hai hame req ke form main milta hai and ham "req.body use karte hain 
// 2.Data ko directly destructured kar lete hain const = {fullName...}
    const {fullName , email, username, password } = req.body
    console.log("email:" , email); // step:1 done user details but pg not runnig here in terminal and in postman.

    // step:2 Validation we have to check null and empty
    // The some() method executes the callback function once for each array element.
    if (
        [fullName,email,username,password].some((field) =>
        field?.trim()=== "") // agar field hai to trim kro and uske baad bhi wo empty hai to true retirn hoga ye sabpe hoga
    ) {
        throw new ApiError(400 , "All fields are required")
    }

    // if (fullName ==""){
    //     throw new ApiError(400, "Fullname is required"); // we can use it but to check on multiple condition we will use array
        
    // }

    // step:3 check for existing user
    // now we call User and find in db for given email or username
    const existedUser = User.findOne({
        $or:[{username},{email}] // $sign gives us various operator to check multiple values at a time so we use it here we can siplpy use like this = User.findOne({email}) to check only one
    })

    if(existedUser){
        throw new ApiError(409, "username or password already exist")
    }

    // we have defined middleware in routes it and till then we get all data in req.body , so middleware add more fields in request 
    // We have already difined multer and saved so call it and get the path ? to check error or give options ( "?" says agar file hai to ye karo )
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar fils is required")
    }

    // step5 upload image on cloudinary just run a method and upload it
    const avatar = await uploadOnCloudinary(avatarLocalPath) // called predefined method as it take time so addede await command 
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar fils is required")

    }

    // step6 now we have to create user object 
    // Db main entry hoti hai user se kyun ki wahi baat kar raha hai db se

    const user = await User.create({ // stored in a user variable
        fullName,
        avatar: avatar.url, // we need just url because it is uploaded on cloud
        coverImage: coverImage?.url || "",// agar hai to lo nhi to empty 
        email,
        passowrd,
        username: username.toLowerCase(),
    })
    // If we don't want some field to show publically we can use this method db give each user a unique id we can use findById to find that particular user and use select method
// step7 & 8
    const createdUser = await User.findById(user._id).select(
        "-password -refreshTocken "
    )
    if (!createdUser){
        throw new ApiError(500 ,"Something went Wrong while registering user " )
    }

// Last Step Response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )
 
})


export {
    registerUser, 

}
