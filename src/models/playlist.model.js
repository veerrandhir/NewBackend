import mongoose , {Schema} from "mongoose";

const playlistSchema = new Schema({
    name: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [
        { // it will arrays of objects we added into array
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
    }
}, {timestamps:true})



export const Playlist = mongoose.model("Playlist", playlistSchema)