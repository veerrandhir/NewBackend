import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; 



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DB connected successfully !! You can do your work Veer ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("ERROR: MONGODB connection error  !! Veer but try restart it", error);
        process.exit(1);
    }
}    

export default connectDB;  