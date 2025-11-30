// const Order = require('../models/orderModel')
// const Product = require('../models/productModel')
// const Errorhandler = require('../utils/errorhander')
// const catchAsyncError = require('../middleware/catchAsyncErrors')

// // creating new Order -->

// exports.newOrder = catchAsyncError(async(req,res,next)=>{
//     const{
//         shippingInfo,
//         itemPrice,
//         shippingPrice,
//         totalPrice,
//         quantity,
//         productId,
//         sellerId
//     } = req.body;

//     const order = await Order.create({
//         shippingInfo,
//         itemPrice,
//         shippingPrice,
//         totalPrice,
//         quantity,
//         user:req.user._id,
//         product:productId,
//         seller:sellerId
//     })
//     res.status(201).json({
//         success:true,
//         message:"Order Placed Successfully",
//         order
//     })
// })

// // get single order -->
// exports.getSingleOrder =catchAsyncError(async(req,res,next)=>{
//     const order = await Order.findById(req.params.id).populate(
//         "user",
//         "name email",
//     ).populate(
//         "seller","name"
//     ).populate('product')

//     if(!order){
//         return next(new Errorhandler(`Order not found with id ${req.params.id}`,404));
//     }
//     res.status(200).json({
//         success:true,
//         order
//     })
// })

// // get loggedIn user orders i.e myOrders -->
// exports.myOrders = catchAsyncError(async(req,res,next)=>{
//     const orders = await Order.find({user:req.user._id}).populate('product')

//     res.status(200).json({
//         success:true,
//         orders
//     })
// })

// // get All orders by seller - Seller -->
// exports.getSellerOrders =catchAsyncError(async(req,res,next)=>{
//     const orders = await Order.find({seller:req.params.sellerId}).populate('user','name').populate('seller',"name").populate('product');

//     if(orders.length === 0){
//         return next(new Errorhandler(`No orders found for seller `,404));
//     }
//     let totalAmount = 0;
//     orders.forEach((ord)=>{
//         totalAmount += ord.totalPrice;
//     })
//     res.status(200).json({
//         success:true,
//         totalResult:orders.length,
//         totalAmount,
//         orders
//     })
// })

// // get All orders - Admin -->
// exports.getAllOrders =catchAsyncError(async(req,res,next)=>{
//     const orders = await Order.find().populate('user','name').populate('seller',"name").populate('product');

//     if(orders.length === 0){
//         return next(new Errorhandler(`Order not found `,404));
//     }
//     let totalAmount = 0;
//     orders.forEach((ord)=>{
//         totalAmount += ord.totalPrice;
//     })
//     res.status(200).json({
//         success:true,
//         totalResult:orders.length,
//         totalAmount,
//         orders
//     })
// })

// // update Order Status - Admin -->
// exports.updateOrder =catchAsyncError(async(req,res,next)=>{
//     const order = await Order.findById(req.params.id)
    
//     if(!order){
//         return next(new Errorhandler(`Order not found with id ${req.params.id}`,404));
//     }

//     if(order.orderStatus === "Delivered"){
//         return next(new Errorhandler(`You have already Delivered this Product`,400));
//     }

//     order.orderStatus = req.body.status;
//     // if(req.body.status === "Delivered"){
        
//     //     await updateStock(order.product,order.quantity)
//     //     order.deliveredAt = Date.now();
//     // }
//     await order.save({validateBeforeSave:false});

//     res.status(200).json({
//         success:true,
//         order
//     })
// })

// async function updateStock(id,quantity){
//     const product = await Product.findById(id);
    
//     product.stock -= quantity;
//     await product.save({validateBeforeSave:false});

// }

// // delete orders - Admin -->
// exports.deleteOrder =catchAsyncError(async(req,res,next)=>{

//     const order = await Order.findByIdAndDelete(req.params.id);

//     if (!order) {
//         return next(new Errorhandler(`Order not found`, 404));
//     }

//     res.status(200).json({
//         success:true,
//         message:"Order Deleted Successfully"
//     })
// })
