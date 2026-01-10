import api from "@/lib/axios";
import toast from "react-hot-toast";

export const deleteAccount = async (
  onLogout?: () => void,
  onSuccess?: () => void
) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    await api.delete("/me", { withCredentials: true });
    toast.success("Account deleted successfully");

    onLogout?.();
    onSuccess?.();
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to delete account");
  }
};
