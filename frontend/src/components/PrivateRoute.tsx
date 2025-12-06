import React from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute : React.FC = () =>{

    const {currentUser} = useSelector((state:any)=>state.user);
    if(!currentUser){
      toast.error("Please Login First !!");
    }
    console.log("c",currentUser)

  return  currentUser ? <Outlet /> : <Navigate to={'/login'} />
}

export default PrivateRoute