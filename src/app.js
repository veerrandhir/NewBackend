// step 3 - import the component express from the express module

import express from "express";
import cors from "cors"; // it is used to allow the request from the different origin
import cookieParser from "cookie-parser"; // it is used to parse the cookie and get the data from the cookie

const app = express(); // create an instance of express
// app.use is used to use the middleware and configure the middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN, // it is used to allow the request from the different origin
    credentials: true // it is used to allow the request from the different origin
}))
// step 4 -> Get the data from the cookie but we get data form json body entries and url and DB and if there is no limit server may crash

app.use(express.json({limit : "200kb"})); // it is used to get the data from the json body entries and we set the limit of the data that we can get from the body

// when we get data form url we can get the data in the form of key value pairs so we should configure the urlencoded
app.use(express.urlencoded({extended: true , limit :"200kb"})); // it is used to get the data from the url in the form of key value pairs.

app.use(express.static("public")); // it is used to serve the static files like images, css, js files in public folder

app.use(cookieParser()); // it is used to parse the cookie and get the data from the cookie and sometimes we have to set the cookie also into user browser.

//Routes import in many files we import it as segrigation 

import userRouter from './routes/user.routes.js';

// routes declaration 
// app.get() earlier we use bacause express and routes were decleared on same file now we decleared route and imported it
// app.use("/users", userRouter) .. ==> it is not standered prectice
// standered practice
app.use("/api/v1/user", userRouter) // suppose we are defining api   
// http://localhost:8000/api/v1/user/register //"If we replace /register with another like /login it will change the page"





// export default app; // export the instance of express
export { app } // export the instance of express both can be used 
