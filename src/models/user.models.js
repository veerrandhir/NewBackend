// To create a model three key things are required "Imoprt mongoose" , "Schema" and "Model" , Create a new schema and export the model with the name const Users

import mongoose , {Schema} from "mongoose"; // Importing mongoose and Schema from mongoose used comma to import multiple modules in one line 

// Creating a new schema for user
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true, // it helps to search the data faster but it will take more space may be expensive.

        },
        email :{
            type: String,
            required: true,
            unique: true,
            lowercase: true,            
        },
        fullname:{
            type : String,
            required: true,
            trim: true,
            index: true,

        },    
        avatar:{
            type: String, // cloudinary image url
            required: true,

        },
        coverImage:{
            type: string ,

        },
        watchHistory:[ // It collets video Id so it is a array and later we can access it
            {
                type: Schema.Types.ObjectId, // getting the id of the video form the video model .
                ref: 'Video' // Refering to the video model this two step is must.
            }
        ],
        password:{
            type: String,
            required: [true, 'Password is required'], // we can add custom message in array
        },
        refreshTocken:{
            type: String,
        }



    },
    {
        timestamps: true, // It will add the created at and updated at field in the database
    }
)

export const Users = mongoose.model('Users', userSchema); // Exporting the model with the name Users "const" is must