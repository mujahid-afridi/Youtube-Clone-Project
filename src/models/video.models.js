import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const videoSchema = new mongoose.Schema({
    videoFile : {
        typeof : String, //cloudinary url
        required : true,
    },
    thumbnail : {
        typeof : String, //cloudinary url
        required : true,
    },
    owner : {
        typeof : Schema.Types.ObjectId,
        ref : 'User'
    },
    tittle : {
        typeof : String,
        required : true,
    },
    description : {
        typeof : String,
        required : true,
    },
    duration : {
        typeof : Number, //take duration from clourniery
        required : true
    },
    views : {
        typeof : Number,
        default : 0
    },
    isPublished : {
        typeof : Boolean,
        default : true
    }
}, {timestamps : true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)