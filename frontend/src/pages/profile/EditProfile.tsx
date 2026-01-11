import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Save } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updateUserSuccess } from "@/redux/authSlice";
import { compressFile } from "@/lib/compression";
import profile from "@/assets/profile.webp"; // or any default avatar

const EditProfile: React.FC = () => {
  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    address: currentUser?.address || "",
    phone: currentUser?.phone || "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (avatar) {
        formData.append("images", avatar);
      }

      if (removeAvatar) {
        formData.append("removeAvatar", "true");
      }

      const { data } = await api.put("/me/update", formData);

      // Update Redux
      dispatch(updateUserSuccess(data.user));

      toast.success("Profile updated successfully");

      // Navigate back to profile
      navigate("/profile");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed: any = await compressFile(file);

      const compressedFile = new File(
        [compressed],
        file.name.replace(/\.\w+$/, ".webp"),
        {
          type: compressed.type || "image/webp",
        }
      );

      setAvatar(compressedFile);
      setAvatarPreview(URL.createObjectURL(compressedFile));
      setRemoveAvatar(false);

      toast.success("Avatar compressed successfully");
    } catch (err) {
      toast.error("Failed to process avatar");
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <img
            src={
              removeAvatar
                ? profile
                : avatarPreview || currentUser?.avatar || profile
            }
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div className="flex flex-col gap-2">
            <label className="cursor-pointer flex items-center gap-2 text-sm text-blue-600">
              <Camera size={16} />
              Change Avatar
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>

            {!removeAvatar && (currentUser?.avatar || avatarPreview) && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-sm text-red-500 hover:underline"
              >
                Remove Avatar
              </button>
            )}
          </div>
        </div>

        {/* Inputs */}
        {[
          { label: "Name", name: "name" },
          { label: "Username", name: "username" },
          { label: "Address", name: "address" },
          { label: "Phone", name: "phone" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            <input
              name={field.name}
              value={(form as any)[field.name]}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        ))}

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          disabled={loading}
          className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
