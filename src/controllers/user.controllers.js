import { asyncHandler } from "../utils/asyncHandler.js"; // imported asyncHandler.js file


const registerUser = asyncHandler( async (req , res) =>{
    res.status(200).json({
        message: "ok Db is Showing message from controller"
    })
})


export {
    registerUser, 

}
