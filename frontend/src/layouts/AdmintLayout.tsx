import AdminSidebar from '../components/admin/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-grow p-6 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
