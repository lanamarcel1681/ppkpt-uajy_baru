"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  MapPin,
  BadgeCheck,
  Save,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function ProfilForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    prodi: "",
    fakultas: "",
    status: "Aktif",
    joinDate: "",
    fotoUrl: "",
  });


  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  // New State for View Mode & Password
  const [viewMode, setViewMode] = useState<"info" | "password">("info");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    const storedEmail = localStorage.getItem("ppkpt_email");

    if (!storedEmail) {
      // Fallback jika tidak ada sesi (dev mode)
      setIsLoading(false);
      setMessage({
        type: "error",
        text: "Sesi tidak ditemukan. Silakan login ulang.",
      });
      return;
    }

    try {
      const res = await fetch(`/api/profil?email=${storedEmail}`);
      const data = await res.json();

      if (res.ok) {
        setUser({
          name: data.data.nama,
          email: data.data.email,
          role: data.data.role,
          prodi: data.data.prodi || "-",
          fakultas: data.data.fakultas || "-",
          status: data.data.status,
          joinDate: data.data.joinDate,
          fotoUrl: data.data.fotoUrl || "",
        });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Gagal mengambil data profil" });
    } finally {
      setIsLoading(false);
    }
  };



  const handlePasswordChange = async () => {
    setMessage({ type: "", text: "" });

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setMessage({ type: "error", text: "Semua kolom password wajib diisi." });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: "error",
        text: "Konfirmasi password baru tidak sesuai.",
      });
      return;
    }

    setIsSaving(true);
    const storedEmail = localStorage.getItem("ppkpt_email");

    try {
      const res = await fetch("/api/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: storedEmail,
          password: passwordForm.currentPassword,
          passwordBaru: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password berhasil diubah!" });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gagal mengubah password.",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Terjadi kesalahan." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Memuat data profil...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
          <p className="text-gray-500">
            Kelola informasi profil dan akun Anda di sini.
          </p>
        </div>
        {message.text && (
          <div
            className={`px-4 py-2 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
            <div className="px-6 pb-6 text-center -mt-12">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mx-auto overflow-hidden">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                    {user.fotoUrl ? (
                      <img src={user.fotoUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                </div>
                {/* Active Status Indicator */}
                <div
                  className={`absolute bottom-2 right-2 w-5 h-5 border-2 border-white rounded-full ${user.status === "Aktif" ? "bg-green-500" : "bg-gray-400"}`}
                  title={user.status}
                ></div>
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-blue-600 font-medium bg-blue-50 py-1 px-3 rounded-full inline-block mt-2">
                {user.role}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                {/* User explicitly requested to remove the edit button. */}

                <button
                  onClick={() => {
                    setViewMode("password");
                  }}
                  className={`w-full py-2 px-4 border rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${viewMode === "password" ? "bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-100" : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"}`}
                >
                  <Lock size={16} /> Ubah Password
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats / Info */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Status Akun
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${user.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  <BadgeCheck size={12} /> {user.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bergabung</span>
                <span className="text-sm font-medium text-gray-800">
                  {user.joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              {viewMode === "info" ? (
                <>
                  <Briefcase size={20} className="text-blue-600" />
                  Informasi Pribadi
                </>
              ) : (
                <>
                  <Lock size={20} className="text-blue-600" />
                  Ubah Password
                </>
              )}
            </h3>

            {viewMode === "info" ? (
              <div className="grid grid-cols-1 gap-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Nama Lengkap
                  </label>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 border-gray-100"
                  >
                    <User size={18} className="text-gray-400" />
                    <span className="text-gray-800 font-medium">
                      {user.name}
                    </span>
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Alamat Email{" "}
                    <span className="text-xs normal-case text-gray-400 italic">
                      (Tidak dapat diubah)
                    </span>
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 opacity-70">
                    <Mail size={18} className="text-gray-400" />
                    <span className="text-gray-800">{user.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Fakultas */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                      Fakultas
                    </label>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 border-gray-100"
                    >
                      <GraduationCap size={18} className="text-gray-400" />
                      <span className="text-gray-800">{user.fakultas}</span>
                    </div>
                  </div>

                  {/* Prodi */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                      Program Studi
                    </label>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 border-gray-100"
                    >
                      <Briefcase size={18} className="text-gray-400" />
                      <span className="text-gray-800">{user.prodi}</span>
                    </div>
                  </div>
                </div>

                {/* Alamat / Lokasi (Static) */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Lokasi Kampus
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-gray-800">
                      Kampus 3 Bonaventura UAJY
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Password Saat Ini
                  </label>
                  <div className="relative bg-gray-50 p-3 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      className="w-full bg-transparent outline-none text-gray-800 pr-10"
                      placeholder="Masukkan password lama..."
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <button type="button" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                      {showPassword.current ? (<EyeOff className="w-5 h-5" />) : (<Eye className="w-5 h-5" />)}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Password Baru
                  </label>
                  <div className="relative bg-gray-50 p-3 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      className="w-full bg-transparent outline-none text-gray-800 pr-10"
                      placeholder="Masukkan password baru..."
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <button type="button" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                      {showPassword.new ? (<EyeOff className="w-5 h-5" />) : (<Eye className="w-5 h-5" />)}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative bg-gray-50 p-3 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      className="w-full bg-transparent outline-none text-gray-800 pr-10"
                      placeholder="Ulangi password baru..."
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <button type="button" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                      {showPassword.confirm ? (<EyeOff className="w-5 h-5" />) : (<Eye className="w-5 h-5" />)}
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setViewMode("info");
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setMessage({ type: "", text: "" });
                    }}
                    type="button"
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition shadow-sm bg-opacity-80"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <Save size={18} /> Simpan Password Baru
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
      />
    </div>
  );
}
