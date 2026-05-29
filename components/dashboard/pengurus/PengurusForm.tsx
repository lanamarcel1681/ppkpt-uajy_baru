"use client";

import { useState, useEffect } from "react";
import { X, Save, RefreshCw } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

interface PengurusFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // Trigger refresh parent
  editData?: any; // Jika null -> Create mode
}

type Prodi = {
  id: number;
  nama: string;
  id_fakultas: number;
};

type Fakultas = {
  id: number;
  nama: string;
  prodi: Prodi[];
};

export default function PengurusForm({
  isOpen,
  onClose,
  onSave,
  editData,
}: PengurusFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    id_role: "2", // Default Tim Satgas
    is_aktif: true,
    prodi: "",
    fakultas: "",
    password: "", // Only sent if filled
  });

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [fakultasList, setFakultasList] = useState<Fakultas[]>([]);

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

  // Fetch Roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };
    fetchRoles();
  }, []);

  // Fetch Fakultas & Prodi
  useEffect(() => {
    const fetchFakultas = async () => {
      try {
        const res = await fetch("/api/cms/fakultas");
        if (res.ok) {
          const data = await res.json();
          setFakultasList(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data fakultas", error);
      }
    };
    fetchFakultas();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          nama: editData.nama_pengurus,
          email: editData.email_pengurus,
          id_role: String(editData.role.id_role),
          is_aktif: editData.is_aktif,
          prodi: editData.prodi || "",
          fakultas: editData.fakultas || "",
          password: "",
        });
        setShowPasswordInput(false); // Default hide password input on edit
      } else {
        // Reset for Create Mode
        setFormData({
          nama: "",
          email: "",
          id_role: roles.length > 0 ? String(roles[0].id_role) : "", // Default to first available role
          is_aktif: true,
          prodi: "",
          fakultas: "",
          password: "ppkpt123", // Default Password
        });
      }
    }
  }, [isOpen, editData, roles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/pengurus";
      const method = editData ? "PUT" : "POST";
      const body: any = { ...formData };

      if (editData) {
        body.id = editData.id_pengurus;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editData
            ? "Berhasil memperbarui pengurus"
            : "Berhasil menambahkan pengurus",
        );
        onSave();
        onClose();
      } else {
        toast.error(data.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-bold text-[#1E4278]">
            {editData ? "Edit Pengurus" : "Tambah Pengurus Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                readOnly={!!editData}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800 ${editData
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-gray-50"
                  }`}
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email (Username Login)
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                placeholder="email@uajy.ac.id"
              />
            </div>

            {/* Role & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.id_role}
                  onChange={(e) =>
                    setFormData({ ...formData, id_role: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-700"
                >
                  {roles.length === 0 && <option value="">Loading...</option>}
                  {roles.map((role) => (
                    <option key={role.id_role} value={role.id_role}>
                      {role.nama_role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status Akun
                </label>
                <select
                  value={formData.is_aktif ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_aktif: e.target.value === "true",
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
            </div>

            {/* Fakultas & Prodi (Dynamic Dropdowns) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fakultas
                </label>
                <select
                  value={formData.fakultas}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fakultas: e.target.value,
                      prodi: "", // Reset prodi when fakultas changes
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-700"
                >
                  <option value="">Pilih Fakultas</option>
                  {fakultasList.map((f) => (
                    <option key={f.id} value={f.nama}>
                      {f.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Program Studi
                </label>
                <select
                  value={formData.prodi}
                  onChange={(e) =>
                    setFormData({ ...formData, prodi: e.target.value })
                  }
                  disabled={!formData.fakultas}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Pilih Program Studi</option>
                  {fakultasList
                    .find((f) => f.nama === formData.fakultas)
                    ?.prodi.map((p) => (
                      <option key={p.id} value={p.nama}>
                        {p.nama}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              {!editData ? (
                // Create Mode: Default Password Info
                <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                  <p className="font-medium">
                    Password Default:{" "}
                    <span className="font-mono bg-blue-100 px-1 rounded">
                      ppkpt123
                    </span>
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    Pengguna dapat mengubah password setelah login pertama kali.
                  </p>
                </div>
              ) : (
                // Edit Mode: Reset Button
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg text-gray-500 text-sm italic">
                    {formData.password === "ppkpt123" ? (
                      <span className="text-green-600 font-medium not-italic">
                        ✓ Password akan direset ke default saat disimpan.
                      </span>
                    ) : (
                      "•••••••• (Tersembunyi)"
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmState({
                        isOpen: true,
                        title: "Reset Password",
                        message: "Apakah Anda yakin ingin mereset password pengguna ini menjadi default (ppkpt123)?",
                        onConfirm: () => setFormData({ ...formData, password: "ppkpt123" }),
                      });
                    }}
                    className="px-4 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition border border-gray-200 flex items-center gap-2"
                    title="Reset ke Default"
                  >
                    <RefreshCw size={16} /> Reset Default
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
              >
                {loading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save size={18} /> Simpan
                  </>
                )}
              </button>
            </div>
          </form>
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
