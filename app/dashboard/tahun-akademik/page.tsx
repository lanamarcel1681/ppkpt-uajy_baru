"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import toast from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ShieldAlert,
  Calendar,
  CheckCircle,
} from "lucide-react";

type TahunAkademik = {
  id_tahunakademik: number;
  nama: string;
  is_active: boolean;
};

export default function KelolaTahunAkademik() {
  const [data, setData] = useState<TahunAkademik[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    is_active: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tahun-akademik");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: TahunAkademik) => {
    if (item) {
      setEditingId(item.id_tahunakademik);
      setFormData({
        nama: item.nama,
        is_active: item.is_active,
      });
    } else {
      setEditingId(null);
      setFormData({
        nama: "",
        is_active: false,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/tahun-akademik/${editingId}`
        : "/api/tahun-akademik";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchData();
        handleCloseModal();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus Tahun Akademik ini?"))
      return;
    try {
      const res = await fetch(`/api/tahun-akademik/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchData();
      } else {
        toast.error("Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    // If it's already active, we don't necessarily toggle it off here, to prevent having NO active year.
    // But for flexibility, let's allow it, or just let them set another as active to auto-disable this one.
    try {
      const res = await fetch(`/api/tahun-akademik/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E4278] font-eras flex items-center gap-3">
              <Calendar className="text-[#EDA60E]" size={28} />
              Tahun Akademik
            </h1>
            <p className="text-gray-500 mt-1">
              Manajemen tahun ajaran untuk pengaturan scope laporan
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#1E4278] text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/10 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Tambah Tahun
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tahun Akademik</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Status Aktif
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500 font-medium"
                    >
                      Belum ada data Tahun Akademik.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id_tahunakademik}
                      className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            handleToggleActive(
                              item.id_tahunakademik,
                              item.is_active,
                            )
                          }
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            item.is_active
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                          title={
                            item.is_active ? "Nonaktifkan" : "Jadikan Aktif"
                          }
                        >
                          {item.is_active ? "Aktif" : "Tidak Aktif"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!item.is_active && (
                            <button
                              onClick={() =>
                                handleToggleActive(
                                  item.id_tahunakademik,
                                  item.is_active,
                                )
                              }
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200 bg-green-50/30"
                              title="Jadikan Aktif"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id_tahunakademik)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
                  {editingId ? "Edit Tahun Akademik" : "Tambah Tahun Akademik"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Tahun Akademik <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    placeholder="Misal: Ganjil 2025/2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-black"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Set Sebagai Tahun Ajaran Aktif
                  </label>
                </div>

                {formData.is_active && (
                  <div className="flex gap-2 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <p>
                      Tahun akademik yang sebelumnya aktif akan otomatis
                      dinonaktifkan.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 bg-[#1E4278] text-white font-medium rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
                  >
                    <Check size={18} />
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
