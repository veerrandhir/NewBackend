import { v2 as cloudinary } from 'cloudinary';
// fs is file system which gives permission to access and manage files , it is inbuilt in node.js 
import fs from "fs";

// This config gives permission to login and access to files
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}); 

//Next we will create a method and pass localfile then unlink file 
// and this file method is quite complex so use try catch
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null 
        //Upload file on cloudinary
        const  response = await cloudinary.uploader.upload(localFilePath , {
            resource_type: "auto"
        })
        // file has been uploaded sussessfully
        console.log("File is uploaded on cloudinary" , response.url);
        return response
        
    } catch (error) {
         fs.unlinkSync(localFilePath) // remove the locally saved temporarry file as the upload operation got failed
         return null;

    }
}


export {uploadOnCloudinary} // lastly we exported file