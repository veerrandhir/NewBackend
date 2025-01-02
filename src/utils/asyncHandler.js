//It create a mehod to handle async function and export it to be used in other files .
//It is used to handle async function in a better way and avoid try catch block in every async function.
 import {mongoose} from "mongoose" // we import mongoose to use it in async function
// we use pormise to handle async function in a better way

const asyncHandler = (fn) => {
     //While runing Db error as it is a higher order fn we need to return it Otherwise it will not work
     
     return (req, res, next) => {
     Promise.resolve(fn(req, res, next)).catch((err)=> next(err)) // passed error and call next function
}
}
export { asyncHandler } // we export the asyncHandler function to be used in other files 




// const asyncHandler = () => {} // we create normal function
// const asyncHandler = (fnuc) => () => {} // function that takes a function and return a function
// const asyncHandler = (fnuc) => () => async () => {} // function that takes a function and return a function that return a async function


// => similarly we can write it as below

// ==> second way using try catch block
// const asyncHandler = (fn) => async (req, res, next) => {

//     try {
//         await fn(req, res, next) // we call the function that we passed to asyncHandler
//     } catch (error) {
//             res.status(err.code || 500).json({ // we also json message for forntend to show error message
//                 success: false,
//                 message: err.message})
//     }
// }

// export { asyncHandler } // we export the asyncHandler function to be used in other files
export default mongoose