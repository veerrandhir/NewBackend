import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";
 
dotenv.config({
    path: "./env"
});


connectDB() // DB comnnection is done here
// AS DB connected and we have use async await so we have to use then catch to handle the promise


.then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`DB connected successfully !! DB listening on port ${process.env.PORT}`);
        }); 
    })
    .catch((error) => {
        console.error("ERROR: MONGODB connection error ", error);
        process.exit(1);
    });

   


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