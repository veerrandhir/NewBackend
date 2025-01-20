import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  // here we call upload form multer
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]), // now we can send images
  registerUser
);
// router.route("/login").post(login) // after that just we don't need to change in app.js just change here or decleare new page here and rest will change

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser); // before we logout we check userlogin through verifyJWT , That's why we use next it redirect to new method after executions ,jwt act as multer

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);
// here we need to use patch while updating otherwise all details will be updated.

// we will use second middleware "upload"
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// if we get data form url i.e, params we user "/c/:username" here username is difined const at "getUserChannelProfile"
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

router.route("history").get(verifyJWT, getWatchHistory);

export default router