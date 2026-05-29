"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Download,
  Eye,
  Loader2,
  X,
  FileBadge,
  Pencil,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

type ArsipType = {
  id_arsip: number;
  judul_arsip: string;
  file_url: string;
  status_arsip: string;
  createdAt: string;
};

export default function Arsip() {
  const [arsips, setArsips] = useState<ArsipType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter, Search, Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("terbaru"); // terbaru | terlama | judul_asc | judul_desc

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadJudul, setUploadJudul] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
    fetchArsip();
  }, []);

  const fetchArsip = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/arsip");
      if (res.ok) {
        const data = await res.json();
        setArsips(data);
      }
    } catch (error) {
      console.error("Failed to fetch Arsip", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadJudul) return;
    if (!uploadFile && !isEditMode) return; // File mandatory only for create

    setIsUploading(true);

    try {
      // Use FormData for BOTH Create and Edit to support file upload on edit
      const formData = new FormData();
      if (uploadFile) formData.append("file", uploadFile);
      formData.append("judul_arsip", uploadJudul);

      if (isEditMode && selectedId) {
        // Edit Mode
        // Note: fetch with FormData sets Content-Type to multipart/form-data automatically with boundary
        const res = await fetch(`/api/dashboard/arsip/${selectedId}`, {
          method: "PUT",
          body: formData,
        });

        if (res.ok) {
          closeModal();
          fetchArsip();
          toast.success("Berhasil memperbarui Arsip");
        } else {
          const err = await res.json();
          toast.error(err.error || "Gagal memperbarui Arsip");
        }
      } else {
        // Create Mode
        const res = await fetch("/api/dashboard/arsip", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          closeModal();
          fetchArsip();
          toast.success("Berhasil mengunggah Arsip");
        } else {
          const err = await res.json();
          toast.error(err.error || "Gagal mengunggah Arsip");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing Arsip");
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadFile(null);
    setUploadJudul("");
    setIsEditMode(false);
    setSelectedId(null);
  };

  const executeDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/dashboard/arsip/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchArsip();
        toast.success("Arsip berhasil dihapus");
      } else {
        toast.error("Gagal menghapus Arsip");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menghapus");
    }
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Hapus Arsip",
      message: "Apakah Anda yakin ingin menghapus Arsip ini?",
      onConfirm: () => executeDelete(id),
    });
  };

  const openEditModal = (arsip: ArsipType) => {
    setUploadJudul(arsip.judul_arsip);
    setSelectedId(arsip.id_arsip);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handlePreview = (url: string) => {
    window.open(url, "_blank");
  };

  // Filter Logic
  const filteredArsips = [...arsips].filter((arsip) => {
    const matchesSearch =
      arsip.judul_arsip.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch
  }).sort((a, b) => {
    switch (sortBy) {
      case "terbaru":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "terlama":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "judul_asc":
        return a.judul_arsip.localeCompare(b.judul_arsip);
      case "judul_desc":
        return b.judul_arsip.localeCompare(a.judul_arsip);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Arsip Dokumen
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola dan arsipkan dokumen
          </p>
        </div>

        <button
          onClick={() => {
            setIsEditMode(false);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
        >
          <Upload size={16} />
          Upload Arsip Baru
        </button>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar: Search & Filter */}
        <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <h3 className="font-semibold text-gray-700 whitespace-nowrap hidden sm:block">Daftar Arsip</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
              {filteredArsips.length} File
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari judul arsip..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-black"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowUpDown size={16} className="text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-black"
              >
                <option value="terbaru">Tanggal Terbaru</option>
                <option value="terlama">Tanggal Terlama</option>
                <option value="judul_asc">Judul (A-Z)</option>
                <option value="judul_desc">Judul (Z-A)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4 w-[60%]">Judul Arsip</th>
                <th className="px-6 py-4 w-[25%]">Tanggal Upload</th>
                <th className="px-6 py-4 text-right w-[15%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Loader2
                        className="animate-spin text-blue-500"
                        size={20}
                      />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredArsips.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FileBadge size={32} className="text-gray-300 mb-3" />
                      <p>Tidak ada arsip yang ditemukan.</p>
                      {searchTerm ? (
                        <p className="text-sm mt-1">Coba sesuaikan kata kunci atau filter Anda.</p>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredArsips.map((item) => (
                  <tr
                    key={item.id_arsip}
                    className="hover:bg-gray-50 transition group"
                  >
                    <td className="px-6 py-4 text-gray-900 font-medium align-top">
                      <div className="flex items-center gap-2">
                        <FileBadge
                          className="text-gray-400 group-hover:text-blue-500 transition shrink-0"
                          size={18}
                        />
                        <div className="line-clamp-2" title={item.judul_arsip}>
                          {item.judul_arsip}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 align-top">
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(item.file_url)}
                          className="text-gray-500 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition"
                          title="Lihat File"
                        >
                          <Eye size={18} />
                        </button>
                        <a
                          href={item.file_url}
                          download
                          className="text-gray-500 hover:text-green-600 p-1.5 hover:bg-green-50 rounded-lg transition"
                          title="Download"
                        >
                          <Download size={18} />
                        </a>
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-gray-500 hover:text-orange-600 p-1.5 hover:bg-orange-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_arsip)}
                          className="text-gray-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition"
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

      {/* Upload Modal (Fixed Overlay) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleUpload}>
              <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">
                  {isEditMode ? "Edit Dokumen Arsip" : "Arsip Baru"}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Arsip
                  </label>
                  <input
                    required
                    type="text"
                    value={uploadJudul}
                    onChange={(e) => setUploadJudul(e.target.value)}
                    placeholder="Masukkan judul arsip..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Arsip (PDF/DOCX){" "}
                    {isEditMode && (
                      <span className="text-gray-400 font-normal">
                        (Opsional - Upload untuk ganti file)
                      </span>
                    )}
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-blue-300 transition cursor-pointer relative group">
                    <input
                      required={!isEditMode}
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={(e) =>
                        setUploadFile(e.target.files?.[0] || null)
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-3 group-hover:scale-110 transition">
                        <Upload size={24} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                        {uploadFile
                          ? uploadFile.name
                          : isEditMode
                            ? "Klik untuk ganti file"
                            : "Klik untuk pilih file"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PDF, DOC, DOCX Max 10MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 font-medium text-sm hover:bg-gray-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  disabled={isUploading}
                >
                  {isUploading && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {isEditMode ? "Simpan Perubahan" : "Simpan Arsip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
      />
    </div>
  );
}
