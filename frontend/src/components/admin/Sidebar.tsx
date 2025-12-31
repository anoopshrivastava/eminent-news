import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutFailure, signOutStart, signOutSuccess } from '@/redux/authSlice/index';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

const Sidebar = () => {
  const nav = [
    {
      icon: "#",
      label: 'News',
      href: '/admin/news',
    },
    {
      icon: "#",
      label: 'Editors',
      href: '/admin/editors',
    },
    {
      icon: "#",
      label: 'Users',
      href: '/admin/users',
    },
    {
      icon: "#",
      label: 'Shorts',
      href: '/admin/shorts',
    },
    {
      icon: "#",
      label: 'Advertisement',
      href: '/admin/ads',
    }
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const response = await api.get(`/logout`);
      if (response.data.success === false) {
        dispatch(signOutFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }
      console.log("Logout Success:", response.data);
      toast.success("Logout Successful");
      dispatch(signOutSuccess());
      navigate('/login');
    } catch (error:any) {
      console.log(error);
      dispatch(signOutFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col sticky left-0 top-0  h-screen items-center text-lg shadow-2xl pb-4 z-50 max-w-[16rem] bg-white border-r-[1px] border-[#62b179]/15">

    <div className="h-32 flex justify-center items-center gap-2 ">
      {/* <img src={logo} alt="" className='h-9 -ml-1'/> */}
      <h1 className="text-[#f40607] text-2xl font-bold mb-3">Admin Dashboard</h1>
    </div>

      <div className="flex flex-col w-full h-full px-4 gap-5 text-center py-3 items-center ">
        {nav.map((item) => (
          <NavLink
          to={item.href}
          key={item.href}
          className={({ isActive }) =>
            `flex items-center w-56 gap-2 pl-2 py-2 font-semibold rounded-sm transition-colors duration-300
             ${isActive ? 'bg-[#ef6262]  text-white border-l-4 border-black' : 'hover:bg-gray-200 border-l-4 hover:border-gray-500 border-transparent'}`
          }
        >
          <p className='max-w-20'>{item.label}</p>
        </NavLink>
        ))}
      </div>

      <div 
        onClick={() => handleLogout()}
        className='flex w-full rounded-md  gap-1 items-center justify-center px-4  mt-2 cursor-pointer'>
        <p className='py-2 hover:border-l-4 rounded-sm px-3 w-full font-semibold hover:bg-gray-200 border-l-4 hover:border-black border-transparent'>Logout</p>
      </div>
    </div>
  );
};

export default Sidebar;
