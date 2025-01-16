import { Router } from "express";
import { loginUser, registerUser ,logoutUser, refreshAccessToken } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"




const router = Router()
 
router.route("/register").post( // here we call upload form multer
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]) // now we can send images
    ,
    registerUser)
// router.route("/login").post(login) // after that just we don't need to change in app.js just change here or decleare new page here and rest will change

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser) // before we logout we check userlogin through verifyJWT , That's why we use next it redirect to new method after executions ,jwt act as multer


router.route("/refresh-token").post(refreshAccessToken)

export default router