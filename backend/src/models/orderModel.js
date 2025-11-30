const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    itemPrice:{
        type:Number,
        default:0,
        required:true
    },
    shippingPrice:{
        type:Number,
        default:0,
        required:true
    },
    totalPrice:{
        type:Number,
        default:0,
        required:true
    },
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            default:"India"
        },
        pincode:{
            type:String,
            required:true
        },
        phoneNo:{
            type:String,
            required:true
        }
    },
    orderStatus:{
        type:String,
        enum: ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
        default:"Processing",
        required:true
    },
    deliveredAt:{
        type:Date,
    }
},{timestamps:true})

module.exports = mongoose.model("Order",orderSchema);