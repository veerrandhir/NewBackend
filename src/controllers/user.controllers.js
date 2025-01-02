import { asyncHandler } from "../utils/asyncHandler.js"; // imported asyncHandler.js file


const registerUser = asyncHandler( async (req , res) =>{
    res.status(200).json({
        message: "ok"
    })
})


export {
    registerUser,

}
