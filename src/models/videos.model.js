import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // Importing the mongoose aggregate paginate for pagination. pagination is the process of dividing a document into discrete pages, either electronic pages or printed pages.
const videoSchema = new Schema(
    {
        videoFile:{
            type: String, // cloudinary video url
            required: true,
            
        },
        thumbnail:{
            type: String, // cloudinary image url
            required: true,
        },
        owner:{
            type : Schema.Types.ObjectId,
            ref : 'User', // Refering to the user model
        },
        title:{
            type: String,
            required: true // no need to add comma

        },
        description:{
            type: String,
            required: true // no need to add comma

        },
        duration:{
            type: Number,
            required: true // no need to add comma

        },
        views:{
            type: Number,
            default: 0 // no need to add comma

        },
        ispublished:{
            type: Boolean,
            default: false // no need to add comma

        }

    }
,{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate); // Adding the plugin to the schema, mongoose give us the ability to create plugin for the schema. we can customize the schema by adding the plugin.// so before exporting the model we need to add the plugin to the schema.

export const Video = mongoose.model('Video', videoSchema);