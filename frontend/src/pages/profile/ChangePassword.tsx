import React, { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      await api.put("/password/update", form);
      toast.success("Password updated successfully");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto px-4 py-8 min-h-[80vh]">
      <h1 className="text-2xl font-semibold mb-8">Change Password</h1>

      <form onSubmit={handleSubmit} className="w-full">
        <div  className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Old Password
          </label>
          <input
            type="password"
            required
            placeholder="Enter Old Password"
            className="w-full border rounded-md px-3 py-2"
            value={form.oldPassword}
            onChange={(e) =>
              setForm({ ...form, oldPassword: e.target.value })
            }
          />
        </div>

        <div className="mb-10">
          <label className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            placeholder="Enter New Password"
            className="w-full border rounded-md px-3 py-2"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded-md">
          {loading ? "Processing.." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
