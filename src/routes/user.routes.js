import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";



const router = Router()
 
router.route("/register").post(registerUser)
// router.route("/login").post(login) // after that just we don't need to change in app.js just change here or decleare new page here and rest will change

export default router