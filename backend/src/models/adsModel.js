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
        required:true,
    },
    images:{
        type:[String],
        default:[]
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