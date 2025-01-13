import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"



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

export default router