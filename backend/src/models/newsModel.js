const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const newsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"]
    },
    images:{
        type:[String],
        default:[]
    },
    category:{
        type:String,
    },
    subCategories:{
        type:[String],
    },
    videoUrl:{
        type:String,
    },
    videoPublicId:{
        type:String,
    },
    videoUrl2:{
      type:String
    },
    likes: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User", }
        }
      ],
    comments: [commentSchema],
    editor:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true,
    }
},{timestamps:true})
module.exports = mongoose.model('News',newsSchema)