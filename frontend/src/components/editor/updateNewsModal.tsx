// import React, { useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const orderStatusList = ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"];

// function UpdateNewsModal({ status, orderId, onClose, onUpdate }) {
//   const [selectedStatus, setSelectedStatus] = useState(status);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.put(
//         `${import.meta.env.VITE_BASE_URL}/api/v1/admin/order/${orderId}`,
//         { status: selectedStatus },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         toast.success('Order Status updated successfully!');
//         onUpdate();
//         onClose();
//       }
//     } catch (error) {
//       console.error('Error updating Order:', error);
//       toast.error(`Error updating Order: ${error?.response?.data?.message || 'Something went wrong.'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Update Order</h2>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="status" className="block mb-2 font-medium">Status:</label>
//           <select
//             id="status"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {orderStatusList.map((status) => (
//               <option key={status} value={status}>
//                 {status}
//               </option>
//             ))}
//           </select>

//           <div className="flex justify-between">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
//               disabled={loading}
//             >
//               {loading ? 'Updating...' : 'Update'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UpdateNewsModal;
