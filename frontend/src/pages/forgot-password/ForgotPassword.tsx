import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import img from "../../assets/loginImg.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/password/forgot", { email });

      setSuccessMsg(data.message || "Reset link sent to your email.");
      toast.success("Reset link sent successfully");
      setEmail("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center md:bg-gray-100">
      <div className="flex bg-white gap-3 p-4 md:p-8 rounded-lg shadow-sm w-[700px] md:w-[800px] h-[500px]">
        
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">

          <h2 className="text-2xl font-bold mb-4 text-center text-[#f40607]">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your registered email. We’ll send you a reset link.
          </p>

          {/* SUCCESS MESSAGE */}
          {successMsg && (
            <p className="text-green-600 text-sm text-center mb-4">
              {successMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2 border bg-transparent rounded-lg focus:outline-none"
                  required
                  disabled={!!successMsg}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="w-full bg-gradient-to-r from-[#f40607] to-red-600 font-bold text-white py-2 px-4 rounded-lg"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-black mt-4 text-sm text-center">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Login
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-gray-100 rounded-r-xl">
          <img src={img} alt="Forgot Password" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
