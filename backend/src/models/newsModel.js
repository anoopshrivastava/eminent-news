const mongoose = require('mongoose')

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
    url:{
        type:String,
    },
    likes: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User", }
        }
      ],
    editor:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true,
    }
},{timestamps:true})
module.exports = mongoose.model('News',newsSchema)