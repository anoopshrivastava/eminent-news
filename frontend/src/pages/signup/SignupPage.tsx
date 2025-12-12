import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "@/redux/authSlice/index";
import { toast } from "react-hot-toast";
import img from "../../assets/loginImg.png";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";

const SignupPage = () => {
  const { role } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      toast.error("Username can only contain letters, numbers, and underscore (no spaces or special characters)");
      return;
    }
    setLoading(true);
    try {
      dispatch(signInStart());
      const response = await api.post(`/register`,
        role === "editor"
          ? { ...formData, role }
          : {
              name: formData.name,
              username: formData.username,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              address: formData.address,
              role,
            },
      );

      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }

      dispatch(signInSuccess(response.data.user));
      toast.success("Signup Successful");
      navigate(role === "editor" ? "/editor/news" : "/home");
    } catch (err:any) {
      toast.error(err.response?.data?.message || "An error occurred");
      dispatch(
        signInFailure(err.response?.data?.message || "An error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center md:bg-gray-100">
      <div className="flex md:items-center justify-center bg-white gap-3 p-4 md:p-8 rounded-lg md:shadow-sm w-[700px] md:w-[900px] h-screen md:h-[500px]">
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 pt-16 md:pt-0 text-center text-red-700">
            {role === "editor" ? "Editor Signup" : "User Signup"}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* <div className={`flex flex-col ${role === "editor" && "md:flex-row"} gap-2`}> */}
              <Input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border bg-transparent rounded-lg mb-3 focus:outline-none"
                required
              />
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border bg-transparent rounded-lg mb-3 focus:outline-none"
                required
              />
              <Input
                type="number"
                name="phone"
                placeholder="Phone No"
                value={formData.phone}
                onChange={handleChange}
                className="w-full  px-3 py-2 text-gray-700 border bg-transparent rounded-lg mb-3 focus:outline-none"
                required
              />
            {/* </div> */}

            {/* <div className={`flex flex-col ${role === "editor" && "md:flex-row"} gap-2`}> */}
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full  px-3 py-2 text-gray-700 border bg-transparent rounded-lg mb-3 focus:outline-none"
                required
              />
              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border bg-transparent rounded-lg mb-3 focus:outline-none"
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full  px-3 py-2 text-gray-700 border bg-transparent rounded-lg mb-3 focus:outline-none"
                required
              />
            {/* </div> */}
            <button
              type="submit"
              className="w-full  bg-gradient-to-r from-red-600 to-red-700 font-bold text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-red-600 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <p className="text-black mt-3 text-sm">Already have an account? <Link to='/login' className="text-blue-500 font-semibold">Login</Link></p>
          {role==="user" ? <p className="text-black mt-3 text-sm">Signup As Editor? <Link to='/signup/editor' className="text-blue-500 font-semibold">Signup Editor</Link></p> : <p className="text-black mt-3 text-sm">Signup As User? <Link to='/signup/user' className="text-blue-500 font-semibold pb-10 md:pb-0">Signup User</Link></p>}
          </form>
          
          
        </div>
        <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-gray-100 rounded-r-xl">
          <img src={img} alt="Signup" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
