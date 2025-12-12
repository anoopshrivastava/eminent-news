// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FiLoader, FiTrash2, FiEdit, FiCopy } from "react-icons/fi";
// import toast from "react-hot-toast";
// import UpdateOrderModal from "../../components/seller/updateOrderModal";
// import SearchInput from "../../components/SearchInput";
// import useDebounce from "../../hooks/useDebounce";

// function AllOrders() {

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(null);
//   const [editingorder, setEditingorder] = useState(null);
//   const [search, setSearch] = useState("")

//   const debouncedSearch = useDebounce(search, 500);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/api/v1/admin/allOrders`,
//         {
//           withCredentials: true,
//         }
//       );
//       if (response?.data?.success) {
//         setOrders(response.data.orders);
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       toast.error("Error fetching orders. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this order?")) return;

//     setDeleting(id);
//     try {
//       const response = await axios.delete(
//         `${import.meta.env.VITE_BASE_URL}/api/v1/admin/order/${id}?searchKey=${search}`,
//         { withCredentials: true }
//       );
//       if (response?.data?.success) {
//         setOrders((prevorders) =>
//           prevorders.filter((order) => order._id !== id)
//         );
//         toast.success("order Deleted Successfully");
//       }
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       toast.error("Error deleting order. Try again.");
//     } finally {
//       setDeleting(null);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [debouncedSearch]);

//   return (
//     <div className="flex-1 flex-col min-h-screen">
//       <div className="flex items-center gap-3  mb-4 mt-2">
//         <div className="flex items-center justify-between pr-10">
//           <h1 className="text-3xl font-bold text-blue-600">All orders</h1>
//         </div>
//         {/* <div>
//           <SearchInput 
//             value={search} 
//             onChange={(e)=>setSearch(e.target.value)} 
//             onClear={()=>setSearch("")}
//             isLoading={loading}
//           />
//         </div> */}
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <FiLoader className="animate-spin text-blue-700 text-4xl" />
//         </div>
//       ) : orders.length === 0 ? (
//         <p className="text-center text-gray-500">No Order Found</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-blue-700 text-white">
//               <tr>
//                 <th className="py-3 px-2 text-left min-w-24">Product</th>
//                 <th className="py-3 px-2 text-left min-w-12">Qty</th>
//                 <th className="py-3 px-2 text-left min-w-24">Item Price</th>
//                 <th className="py-3 px-2 text-left min-w-24">TotalPrice</th>
//                 <th className="py-3 px-2 text-left min-w-28">User Name</th>
//                 <th className="py-3 px-2 text-left min-w-28">Seller Name</th>
//                 <th className="py-3 px-2 text-left min-w-24">Status</th>
//                 <th className="py-3 px-2 text-left">Date</th>

//                 <th className="py-3 px-2 text-left min-w-24">Address</th>
//                 <th className="py-3 px-2 text-left min-w-24">City</th>
//                 <th className="py-3 px-2 text-left min-w-24">State</th>
//                 <th className="py-3 px-2 text-left min-w-24">Pincode</th>
//                 <th className="py-3 px-2 text-left min-w-24">Phone No</th>

//                 <th className="py-3 px-2 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="border-b hover:bg-blue-50">
//                   <td
//                     className="py-3 px-2 max-w-[150px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.product.name}
//                   >
//                     {order.product.name}
//                     <button
//                       onClick={() => {
//                         navigator.clipboard.writeText(order.product._id);
//                         toast.success("Product ID copied to clipboard!");
//                       }}
//                       className="text-gray-600 cursor-pointer hover:text-black focus:outline-none pl-1"
//                       title="Product ID"
//                     >
//                       <FiCopy />
//                     </button>
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[100px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.quantity}
//                   >
//                     {order.quantity}
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[100px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.itemPrice}
//                   >
//                     {order.itemPrice}
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[100px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.totalPrice}
//                   >
//                     {order.totalPrice}
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[150px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.user.name}
//                   >
//                     {order.user.name}
//                     <button
//                       onClick={() => {
//                         navigator.clipboard.writeText(order.user._id);
//                         toast.success("User ID copied to clipboard!");
//                       }}
//                       className="text-gray-600 cursor-pointer hover:text-black focus:outline-none pl-1"
//                       title="User ID"
//                     >
//                       <FiCopy />
//                     </button>
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[150px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.seller.name}
//                   >
//                     {order.seller.name}
//                     <button
//                       onClick={() => {
//                         navigator.clipboard.writeText(order.seller._id);
//                         toast.success("Seller ID copied to clipboard!");
//                       }}
//                       className="text-gray-600 cursor-pointer hover:text-black focus:outline-none pl-1"
//                       title="Seller ID"
//                     >
//                       <FiCopy />
//                     </button>
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[120px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.orderStatus}
//                   >
//                     {order.orderStatus}
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[120px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.createdAt.split("T")[0]}
//                   >
//                     {order.createdAt.split("T")[0]}
//                   </td>

//                   <td
//                     className="py-3 px-2 max-w-[200px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.shippingInfo.address}
//                   >
//                     {order.shippingInfo.address}
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[100px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.shippingInfo.city}
//                   >
//                     {order.shippingInfo.city}
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[100px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.shippingInfo.state}
//                   >
//                     {order.shippingInfo.state}
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[80px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.shippingInfo.pincode}
//                   >
//                     {order.shippingInfo.pincode}
//                   </td>
//                   <td
//                     className="py-3 px-2 max-w-[120px] truncate whitespace-nowrap overflow-hidden"
//                     title={order.shippingInfo.phoneNo}
//                   >
//                     {order.shippingInfo.phoneNo}
//                   </td>

//                   <td className="py-3 px-2 text-center flex justify-center gap-4">
//                     <button
//                       onClick={() => setEditingorder(order)}
//                       className="text-blue-500 hover:text-blue-700 focus:outline-none cursor-pointer"
//                       title="Edit order"
//                     >
//                       <FiEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(order._id)}
//                       className="text-[#f40607] hover:text-red-700 focus:outline-none cursor-pointer"
//                       disabled={deleting === order._id}
//                       title="Delete order"
//                     >
//                       {deleting === order._id ? (
//                         <FiLoader className="animate-spin text-[#f40607]" />
//                       ) : (
//                         <FiTrash2 />
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {editingorder && (
//         <UpdateOrderModal
//         status={editingorder.orderStatus}
//         orderId={editingorder._id}
//         onClose={() => setEditingorder(null)}
//         onUpdate={fetchOrders}
//         />
//       )}
//     </div>
//   );
// }

// export default AllOrders;
