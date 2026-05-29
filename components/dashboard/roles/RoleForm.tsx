"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // Trigger refresh parent
  editData?: any; // Jika null -> Create mode
}

export default function RoleForm({
  isOpen,
  onClose,
  onSave,
  editData,
}: RoleFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_role: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          nama_role: editData.nama_role,
        });
      } else {
        setFormData({
          nama_role: "",
        });
      }
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/roles";
      const method = editData ? "PUT" : "POST";
      const body: any = { ...formData };

      if (editData) {
        body.id_role = editData.id_role;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editData ? "Berhasil memperbarui role" : "Berhasil menambahkan role",
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-[#1E4278]">
            {editData ? "Edit Role" : "Tambah Role Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nama Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Role
            </label>
            <input
              type="text"
              required
              value={formData.nama_role}
              onChange={(e) =>
                setFormData({ ...formData, nama_role: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
              placeholder="Contoh: Administrator"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
  );
}
