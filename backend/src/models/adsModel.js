const mongoose = require('mongoose')

const adsSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true
    },
    description:{
        type:String,
    },
    category:{
        type:String,
        enum: ["Banner", "Highlights", "FullPageShorts", "Video"],
        required:true,
    },
    images:{
        type:[String],
        default:[]
    },
    video: {
      url: String,
      publicId: String,
      ratio: {
        type: String,
        enum: ["9:16", "16:9"],
      },
    },
    isApproved:{
        type:Boolean,
        default: false,
    },
    url:{
        type:String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},{timestamps:true})
module.exports = mongoose.model('Ads',adsSchema)