"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit2,
  Save,
  X,
  Camera,
  Check,
  AlertCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageCropDialog from "./ImageCropDialog";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  notelp: string;
  address: string;
  bio: string;
  createdAt: string;
  avatar?: string;
}

const ProfileInformationForm = ({ stats, level, rank }: any) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State Data User
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
  
  // State Image Crop
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State Notifikasi (Toast)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  const avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah";

  // Timer: Hilang otomatis dalam 3 detik
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users/profile");
        if (!response.ok) {
          throw new Error("Gagal memuat data pengguna");
        }
        const data = await response.json();
        setUser(data.user);
        setEditedUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session?.user?.email]);

  // --- HANDLE SAVE TEXT INFO ---
  const handleSave = async () => {
    if (!editedUser) return;

    try {
      setIsSaving(true);
      
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedUser.name || "",
          notelp: editedUser.notelp || "",
          address: editedUser.address || "",
          bio: editedUser.bio || "",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menyimpan data");
      }

      const data = await response.json();
      setUser(data.user);
      setEditedUser(data.user);
      setIsEditing(false);

      // Notif Sukses Edit Info
      setToast({
        show: true,
        message: "Informasi profile berhasil diperbarui!",
        type: 'success'
      });

    } catch (err) {
      console.error("Error saving user:", err);
      // Notif Gagal
      setToast({
        show: true,
        message: err instanceof Error ? err.message : "Gagal memperbarui informasi",
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser(user);
    }
    setIsEditing(false);
  };

  // --- HANDLE AVATAR UPLOAD ---
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setToast({ show: true, message: "Format harus JPG, PNG, atau WebP", type: 'error' });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setToast({ show: true, message: "Ukuran file maksimal 5MB", type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      setIsUploadingAvatar(true);

      const formData = new FormData();
      formData.append("avatar", croppedImageBlob, "avatar.jpg");

      const response = await fetch("/api/users/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal mengupload avatar");
      }

      const data = await response.json();
      
      if (user) {
        const updatedUser = { ...user, avatar: data.avatarUrl };
        setUser(updatedUser);
        setEditedUser(updatedUser);
      }

      setShowCropDialog(false);
      setSelectedImage(null);

      // Notif Sukses Ganti Foto
      setToast({
        show: true,
        message: "Foto profile berhasil diubah!",
        type: 'success'
      });

    } catch (err) {
      console.error("Error uploading avatar:", err);
      // Notif Gagal Ganti Foto
      setToast({
        show: true,
        message: "Gagal mengubah foto profile",
        type: 'error'
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCloseCropDialog = () => {
    setShowCropDialog(false);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (!user || !editedUser) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">Gagal memuat data pengguna</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm relative">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Informasi Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
              Batal
            </button>
          </div>
        )}
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
        <div className="relative inline-block group">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage 
              src={user.avatar || avatarUrl} 
              alt={user.name} 
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-2xl font-bold">
              {user.name?.substring(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-1 left-1.5 p-2 rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploadingAvatar}
              >
                <Camera className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        <div className="space-y-2 w-full">
          <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
          <p className="text-slate-600">{user.email}</p>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm font-semibold">
              Level {level}
            </span>
            <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-bold shadow-[0_6px_18px_-8px_rgba(249,168,37,0.9)]">
              Mashaallah
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
              Peringkat #{rank}
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <User className="h-4 w-4" />
              Nama Lengkap
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                disabled={isSaving}
              />
            ) : (
              <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{user.email}</p>
            <p className="text-xs text-slate-500 mt-1">Email tidak dapat diubah</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Phone className="h-4 w-4" />
              Nomor Telepon
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.notelp ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, notelp: e.target.value || "" })
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                disabled={isSaving}
              />
            ) : (
              <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">
                {user.notelp || "-"}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <MapPin className="h-4 w-4" />
              Lokasi / Alamat
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.address ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, address: e.target.value || "" })
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                disabled={isSaving}
              />
            ) : (
              <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">
                {user.address || "-"}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <User className="h-4 w-4" />
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={editedUser.bio ?? ""}
              onChange={(e) =>
                setEditedUser({ ...editedUser, bio: e.target.value || "" })
              }
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none disabled:opacity-50"
              disabled={isSaving}
            />
          ) : (
            <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">
              {user.bio || "-"}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="h-4 w-4" />
            Bergabung Sejak
          </label>
          <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{joinDate}</p>
        </div>
      </div>

      {/* Crop Dialog */}
      {showCropDialog && selectedImage && (
        <ImageCropDialog
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          onClose={handleCloseCropDialog}
        />
      )}

      {/* --- TOAST NOTIFICATION (FIXED MOBILE UI) --- */}
      {toast && (
        <div className={`
          fixed z-[100] transition-all duration-300
          /* MOBILE: Top Center, lebar menyesuaikan tapi tidak mentok layar */
          top-4 left-1/2 -translate-x-1/2 w-full max-w-[90vw] sm:max-w-md
          
          /* DESKTOP: Bottom Right */
          md:top-auto md:left-auto md:bottom-6 md:right-6 md:translate-x-0 md:w-auto
        `}>
          <div className={`
            flex items-center justify-between gap-3 px-5 py-4 
            rounded-2xl shadow-2xl border backdrop-blur-md
            ${toast.type === 'success' 
              ? 'bg-emerald-500 text-white border-emerald-400' 
              : 'bg-red-500 text-white border-red-400'
            }
            /* Animasi masuk */
            animate-[slideDown_0.5s_cubic-bezier(0.16,1,0.3,1)] 
            md:animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)]
          `}>
            
            {/* Bagian Kiri: Icon & Pesan */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
               {/* Icon Circle */}
              <div className="shrink-0 bg-white/20 rounded-full p-1.5 flex items-center justify-center">
                {toast.type === 'success' ? (
                  <Check className="h-4 w-4 text-white stroke-[3]" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-white stroke-[3]" />
                )}
              </div>

              {/* Teks Pesan */}
              <p className="text-sm font-semibold leading-snug break-words">
                {toast.message}
              </p>
            </div>

            {/* Bagian Kanan: Tombol Close */}
            <button 
              onClick={() => setToast(null)}
              className="shrink-0 ml-1 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4 text-white/90" />
            </button>
          </div>
        </div>
      )}

      {/* Animasi CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProfileInformationForm;