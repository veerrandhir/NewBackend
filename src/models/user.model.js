// To create a model three key things are required "Imoprt mongoose" , "Schema" and "Model" , Create a new schema and export the model with the name const Users

import mongoose, { Schema } from "mongoose"; // Importing mongoose and Schema from mongoose used comma to import multiple modules in one line
import jwt from "jsonwebtoken"; // Importing jwt for creating tocken used for authentication and authorization
import bcrypt from "bcrypt"; // Importing bcrypt for hashing the password used for security purpose password should not be stored in plain text

// Creating a new schema for user
const userSchema = new Schema(
  {
    username: {   
      type: String,   
      required: true,   
      unique: true,   
      lowercase: true,   
      trim: true,
      index: true, // it helps to search the data faster but it will take more space may be expensive.
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary image url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary image url
    },
    // It is the single field which will create user model bigger.
    watchHistory: [
      // It collets video Id so it is a array and later we can access it
      {
        type: Schema.Types.ObjectId, // getting the id of the video form the video model .
        ref: "Video", // Refering to the video model this two step is must.
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"], // we can add custom message in array
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // It will add the created at and updated at field in the database
  }
);
// pre save hook is used to hash the password before saving it to the database or doing any operation before saving the data to the database. pre is a call back function which will be called before saving the data to the database. It is a middleware function. go to middleware in mongoose documentation for more information. // we can use async and await in the pre save hook to make the code more readable and easy to understand./ we can use next to move to the next middleware function. as you know we have error , req, res and next in the express middleware function.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // if the password is not modified then return next, checking wether the password is modified or not. if the password is not modified then return next. and password will not be hashed again.
  this.password = await bcrypt.hash(this.password, 10); // hashing the password with the help of bcrypt and 10 is the number of rounds to hash the password. pre encrypt the password before saving it to the database.
  next(); // moving to the next middleware function
});
// Hash generate encrypted password so when user login we can compare the password with the encrypted password. so for this we have to create a method in the schema.
// just like middleware we can create a method in the schema.
// we can create multiple methods in the schema.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // comparing the password with the encrypted password.
};
// jwt has sign method which generates the token
// same way we can genetate access tocken for the user.

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    // we can directly return the jwt.sign or create a var
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    }, // it require two things payload and secret key
    process.env.ACCESS_TOKEN_SECRET, //it req the secret key because on which basis the tocken will be generated
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    } // genrted tocken will expire after the time mentioned in the env file so that the user has to login again. and it is a good practice to expire the tocken after some time. so req reference
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema); // Exporting the model with the name Users "const" is must
