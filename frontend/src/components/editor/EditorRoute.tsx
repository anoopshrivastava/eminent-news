import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditorRoute = () => {
  const currentUser = useSelector((state:any) => state.user.currentUser);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'editor') {
      toast.error('Access Denied! Editor only.');
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return currentUser.role === 'editor' ? <Outlet /> : <p className='flex mt-20 justify-center items-center'>Only Editor Can Access This Page!!</p>;
};

export default EditorRoute;

