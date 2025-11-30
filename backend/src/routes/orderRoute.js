// const express = require('express')
// const {isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
// const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder, getSellerOrders } = require('../controllers/orderController');

// const router = express.Router();

// // creating a new order -->
// router.post('/order/new',isAuthenticatedUser,newOrder);

// // get single order detail 
// router.get('/order/:id',isAuthenticatedUser,getSingleOrder)

// //  get logged in user order i.e myOrders -->
// router.get('/orders/me',isAuthenticatedUser,myOrders);

// // get All orders - Seller  -->
// router.get('/seller/allOrders/:sellerId',isAuthenticatedUser,authorizeRoles("seller"),getSellerOrders);

// // get All orders - Admin  -->
// router.get('/admin/allOrders',isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);

// // update order status - admin -->
// router.put('/admin/order/:id',isAuthenticatedUser,authorizeRoles("admin","seller"),updateOrder)

// // delete order - admin -->
// router.delete('/admin/order/:id',isAuthenticatedUser,authorizeRoles("admin","seller"),deleteOrder)

// module.exports = router;