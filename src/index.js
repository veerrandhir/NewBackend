import dotenv from "dotenv";
import connectDB from "./db/index.js";
 
dotenv.config({
    path: "./env"
});


connectDB();


   


// Yaar ye second time pure DB connect kar rhe hain kuchh kaam nhi aa raha hai1

// import express from "express";
// const app = express()
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
//         app.on("error" ,(error) =>{
//             console.log("ERROR: ", error);
//             throw error
            
//         } )
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listning on port ${process.env.PORT}`);
//         })
            

//     } catch (error) {
//         console.log("ERROR: ", error);
//         throw error
        
//     }
// })()