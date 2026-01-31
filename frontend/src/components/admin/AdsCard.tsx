import React from "react";
import toast from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import api from "@/lib/axios";
import type { Ads } from "@/types/ads";
import { Switch } from "../ui/switch";

interface AdsCardProps {
  ads: Ads;
  setAds?: React.Dispatch<React.SetStateAction<Ads[]>>;
  isAdmin: boolean;
}

const AdsCard: React.FC<AdsCardProps> = ({ ads, setAds, isAdmin = false }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ads item?"))
      return;

    try {
      const response = await api.delete(`/ads/${ads._id}`);

      const resData = response?.data ?? {};
      if (resData.success === true) {
        if (setAds) {
          setAds((prev) => prev.filter((n) => n._id !== ads._id));
        }
        toast.success("Ads Deleted Successfully");
      } else {
        toast.error(resData.message ?? "Failed to delete Ads");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error Deleting Ads");
    }
  };

  const handleToggleApprove = async () => {
    try {
      const res = await api.put(`/ads/${ads._id}/approve`);

      if (res.data.success && setAds) {
        setAds((prev) =>
          prev.map((a) =>
            a._id === ads._id ? { ...a, isApproved: res.data.isApproved } : a
          )
        );
      }

      toast.success(res.data.isApproved ? "Ad Approved" : "Ad Unapproved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update approval status");
    }
  };

  const isVideoAd = ads.category === "Video";

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden w-80 md:w-72">
        {/* Image block with edit/delete overlay */}
        <div className="relative h-48 md:h-60 overflow-hidden bg-gray-100">
          {/* <img
            src={ads.images?.[0] ?? ""}
            alt={ads.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          /> */}
          {isVideoAd ? (
            <video
              src={ads.video?.url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={ads.images?.[0]}
              alt={ads.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          )}

          <div className="absolute bottom-2 left-2 z-10">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold
      ${
        ads.isApproved ? "bg-green-600 text-white" : "bg-yellow-500 text-black"
      }`}
            >
              {ads.isApproved ? "Approved" : "Approval Pending"}
            </span>
          </div>

          {/* Edit & Delete buttons (top-right) */}
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={handleDelete}
              className="bg-rose-600 p-1 rounded-full text-white hover:bg-rose-700 shadow"
              title="Delete"
            >
              <FiTrash />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 pb-3 pt-2">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg md:text-base font-semibold line-clamp-2 text-gray-900 leading-[1.1]">
              {ads.title}
            </h3>

            {/* Admin approve toggle */}
            {isAdmin && (
              <button
                onClick={handleToggleApprove}
                className={`flex items-center justify-center`}
                title={ads.isApproved ? "Unapprove Ad" : "Approve Ad"}
              >
                {isAdmin && (
                  <Switch
                    checked={ads.isApproved}
                    onCheckedChange={handleToggleApprove}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-400"
                  />
                )}
              </button>
            )}
          </div>

          <p className="font-medium text-gray-700 text-sm md:text-xs line-clamp-2 leading-[1.2]">
            Description : {ads.description}
          </p>

          <div className="pt-1 text-xs font-medium text-gray-700">
            <span className="mr-3">Category : {ads.category ?? "Other"} {isVideoAd && ( '(' + ads.video?.ratio + ')' )}</span>
          </div>

          {isAdmin && <div className="pt-1 text-xs font-medium text-gray-700">
            <span className="mr-3">CreatedBy : {ads?.createdBy?.name ?? "Unknown"}</span>
          </div>}
        </div>
      </div>
    </>
  );
};

export default AdsCard;
