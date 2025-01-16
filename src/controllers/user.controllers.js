import { asyncHandler } from "../utils/asyncHandler.js"; // imported asyncHandler.js file
import {ApiError} from "../utils/ApiErrors.js"

import {User} from "../models/user.model.js"

import {uploadOnCloudinary} from "../utils/cloudinary.js"

import {ApiResponse} from "../utils/ApiResponse.js"

import jwt from "jsonwebtoken"


const generateAccessTokenRefreshTokens = async(userId) => {
    try { // we are using trycatch here to handle error
        const user = await User.findById(userId) // we get userId for generating token
         // always remember when we need user form Database like mongodb we use "User" and for "user" for self defined
         const accessToken = user.generateRefreshToken() //Extracted Or call from user.model and hold in var
         const refreshToken = user.generateAccessToken()

         // listen actually we provide accessToken to user but keep refreshToken so that user should not input passowrd again and again,// now we need to add it to userDB which is quite simple
         // And we have user access through which we get access of all us

         user.refreshToken = refreshToken // form user we get refreshToken from user schema So we add into user but now we need to save it 
         await user.save({validateBeforeSave: false}) // when we save something mongooes model kickin means we req. passowrd but here password is not available so we add an aditional object parameter validateBeforeSave and make it false

        return{accessToken , refreshToken}


    } catch (error) {  
        throw new ApiError(500, "Sommethinf went wrong while Generating Refresh and access token")
    }
}

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
    console.log("fullName:", fullName);
    console.log("username:", username);
    // step:2 Validation we have to check null and empty
    // The some() method executes the callback function once for each array element.
    if (
        [fullName,email,username,password].some((field) =>
        field?.trim()=== "") // agar field hai to trim kro and uske baad bhi wo empty hai to true return hoga ye sabpe hoga
    ) {
        throw new ApiError(400 , "All fields are required")
    }
    
    // if (fullName ==""){
        //     throw new ApiError(400, "Fullname is required"); // we can use it but to check on multiple condition we will use array
        
    // }

    // step:3 check for existing user
    // now we call User and find in db for given email or username
    const existedUser = await User.findOne({
        $or: [{ username: username }, { email: email }] // Explicitly specify field-value pairs
    });
    
    if (existedUser) {
        throw new ApiError(409, "username or email already exists");
    }
    
    // we have defined middleware in routes it and till then we get all data in req.body , so middleware add more fields in request 
    // We have already difined multer and saved so call it and get the path ? to check error or give options ( "?" says agar file hai to ye karo )
    
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // let avatarLocalPath;
    // if (req.files && Array.isArray(req.files.avatar)
    // && req.files.avatar.length > 0) {
    // avatarLocalPath = req.files.avatarLocalPath[0].path       
    // }

    let  coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)
    && req.files.coverImage.length >0 ){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath){

        throw new ApiError(400,"Avatar file is required")
    }

    // step5 upload image on cloudinary just run a method and upload it
    const avatar = await uploadOnCloudinary(avatarLocalPath) // called predefined method as it take time so addede await command 
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(401,"Avatar file is required")

    }

    // step6 now we have to create user object 
    // Db main entry hoti hai user se kyun ki wahi baat kar raha hai db se

    const user = await User.create({ // stored in a user variable
        fullName,
        avatar: avatar.url, // we need just url because it is uploaded on cloud
        coverImage: coverImage?.url || "",// agar hai to lo nhi to empty 
        email,
        username: username.toLowerCase(),
    })
    
    // If we don't want some field to show publically we can use this method db give each user a unique id we can use findById to find that particular user and use select method
    // step7 & 8
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken "
    )
    if (!createdUser){
        throw new ApiError(500 ,"Something went Wrong while registering user " )
    }
    
    // Last Step Response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )
    
})

// we will think how to login and accordingly write the programe , imagine the senerio
const loginUser = asyncHandler( async (req, res)=>{
    // req body -> data (Firstly we request data from body)
    // username or email 
    // find user 
    // password check
    // access and refresh token
    // send cookies (mostly we send tokens and data to user in secure cookies)
    
    // so firstly we need to get data form req.body 
    const {username, email, password} = req.body // stored each as an object
    if(!username && !email){
        throw new ApiError(400, "username or email is required")

    }
    const user = await User.findOne({ // find user or email form body data to login
        $or: [{username}, {email}]
    })
    if (!user){  // if user is not registered
        throw new ApiError(400, "username or email not find kindly register")
    }
    // now we will chack password and if password : true return assessTocken 
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials or invalid password")
    }

    // if password is correct we need to generate access tocken and we will use it many
    // time so we should create a method for it.

    const {accessToken, refreshToken} = await generateAccessTokenRefreshTokens(user._id) // through this method we get accessToken and refreshToken , so lets destructure it by passing parameter into const variable 
    

    //Actually when we call user and generate tokens by default it get password and refreshToken which is not req as per security standared so to prevent it we decleared a new var and again call DB if Db is expensive then we shold not call db In place we need to update existing DB but here we are calling db again 

    const loggedInUser = await User.findById(user._id). // 
    select("-password -refreshToken") // it was an optional step and now we need to send cookies 

    // We send cookies in options var and again it is an object 


    const options = {
        httpOnly : true,
        secure : true // by default anyone can modify cookies , if use these option it disable options to modify cookies through front-end only they can see it.
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json( // along we need to send json response 
        // as we already has sent tokens so why we need to send it again in json ? actually we are assuming if user wants to manage tocken self so we are sending in json
        new ApiResponse(
            
            200,
            {
                user: loggedInUser, accessToken, // here User field is Data form ApiResponse.js

                refreshToken
            },
            "User logged In Successfully"
        )
    )

})

// Now we will handle logout 
// Assume the senerio To logout a user
// #1. user cookies should reset , it can manage only through server
// #2. generateAccessTokenRefreshTokens must clear through model
// Then user will logout correctly

const logoutUser = asyncHandler(async(req, res)=>{
    // Now we have access of req so can use req.user
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { // set method from db and set reftoken undefined
                refreshToken: undefined
            }
        }, // we can add more fields here
        {
            new: true // it give new value
        }

    )
    const options = {
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .clearCookies("accessToken",options)
    .clearCookies("refreshToken",options)
    .json(new ApiResponse(200, {}, "User logged out"))

})


// See accessToken and refreshToken work in such a way user don't need to give password again and again.
// Suppose user token is expaied then in frontend user will get error 401 so instead of receiving  passowrd from user we ask to hit an endpoint through which we can generate new token and verify it through tocken we have in DB , so that user can relogin without passord and new login session restarts withot login
// then frontend send another refreshToken to verify that's why we need an endpoint so let's do it.
// crate a controller
const refreshAccessToken = asyncHandler(async (req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken // if using web then get token through cookies and for mobile app use body . // actually we have user hit can end through cookies to get refreshToken . #we also have refreshToken in Db so it's incomingRfT 

    if (!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }
  try {
      const decodedToken = jwt.verify( // se get endoded token but we need row original token so jwt verify it and gives us
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET 
      )
      const user = await User.findById(decodedToken?._id)
      if (!user){
          throw new ApiError(401,"Invalid refreshToken")
      }
      // Now we need to chech refreshToken receiving from user and refreshToken we have both should same 
      if(incomingRefreshToken !== user?.refreshToken){
          throw new ApiError(401,"Refresh token is expired or used")
  
      }
      // Create options and genereateAccessRefreshToken because we need to give encoded token
  
      const options = {
          httpOnly: true,
          secure:true
      }
  // our accessToken value is same but refreshToken has new Val so we used var "newRefreshToken"
      const {accessToken , newRefreshToken} = await generateAccessTokenRefreshTokens(user._id)
      // then send return status and cookies
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
          new ApiResponse(
              200,
              {accessToken, refreshToken:newRefreshToken},
              "Access Token Refreshed Successfully"
  
          )
      )
  
  
  } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
