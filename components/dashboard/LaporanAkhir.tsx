"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Eye,
  ChevronDown,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";
import { getAcademicYear } from "@/lib/academicYear";

type Report = {
  id: number;
  judul: string;
  semester: string;
  fileUrl: string;
  tipeFile: "pdf" | "docx";
  createdAt: string;
  pengurus: {
    nama_pengurus: string;
    role: {
      nama_role: string;
    };
  };
};

export default function LaporanAkhir() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("Semua Semester");
  const [tahunList, setTahunList] = useState<any[]>([]);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSemester, setUploadSemester] = useState(""); // Akan di-set defaultnya setelah fetch

  // Preview State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // User Role State
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProdi, setUserProdi] = useState<string | null>(null); // Optional: simulate Study Program

  // Computed Academic Year using current mathematical date
  const currentAcademicYear = getAcademicYear(new Date());
  const [activeTahun] = useState<string>(currentAcademicYear);

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
    // Get user info from localStorage
    const role = localStorage.getItem("ppkpt_role");
    setUserRole(role);

    if (role === "Tim Satgas") {
      setSelectedSemester(currentAcademicYear);
    }

    // Fetch Tahun Akademik List
    const fetchTahunList = async () => {
      try {
        const res = await fetch("/api/tahun-akademik");
        if (res.ok) {
          const data = await res.json();
          setTahunList(data);

          // Set default active if available for Upload
          const activeTahun = data.find((t: any) => t.is_active);
          if (activeTahun) {
            setUploadSemester(activeTahun.nama);
          } else if (data.length > 0) {
            setUploadSemester(data[0].nama);
          }
        }
      } catch (err) {
        console.error("Gagal memuat daftar Tahun Akademik", err);
      }
    };
    fetchTahunList();
  }, []);

  // Fetch Reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/dashboard/laporan-akhir?semester=${selectedSemester}`,
      );
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedSemester]);

  // Handle Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle) return;
    if (!uploadFile && !isEditMode) return; // File optional for edit

    setIsUploading(true);

    try {
      const formData = new FormData();
      if (uploadFile) formData.append("file", uploadFile);
      formData.append("judul", uploadTitle);
      formData.append("semester", uploadSemester);

      if (isEditMode && selectedId) {
        // Edit Mode
        const res = await fetch(`/api/dashboard/laporan-akhir/${selectedId}`, {
          method: "PUT",
          body: formData, // Auto sets multipart/form-data
        });

        if (res.ok) {
          closeModal();
          fetchReports();
          toast.success("Berhasil memperbarui laporan");
        } else {
          try {
            const err = await res.json();
            toast.error(err.error || "Gagal memperbarui");
          } catch (e) {
            toast.error("Gagal memperbarui");
          }
        }
      } else {
        // Create Mode
        formData.append("id_pengurus", "1"); // TEMPORARY

        const res = await fetch("/api/dashboard/laporan-akhir", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          closeModal();
          fetchReports();
          toast.success("Berhasil mengunggah laporan");
        } else {
          try {
            const err = await res.json();
            toast.error(err.error || "Gagal mengunggah");
          } catch (e) {
            toast.error("Gagal mengunggah");
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing");
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadFile(null);
    setUploadTitle("");
    setIsEditMode(false);
    setSelectedId(null);
  };

  const executeDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/dashboard/laporan-akhir/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchReports();
        setSelectedReport(null); // Clear selection if deleted
        toast.success("Laporan berhasil dihapus");
      } else {
        toast.error("Gagal menghapus laporan");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan");
    }
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Hapus Laporan",
      message: "Apakah Anda yakin ingin menghapus laporan ini?",
      onConfirm: () => executeDelete(id),
    });
  };

  const openEditModal = (report: Report) => {
    setUploadTitle(report.judul);
    setUploadSemester(report.semester);
    setSelectedId(report.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const isEditor = userRole === "Ketua" || userRole === "Sekretaris";

  return (
    <div className="space-y-6">
      {/* Header Card (KHS Style) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Laporan Akhir Semester
              </h1>
              <p className="text-sm text-gray-500">
                Arsip laporan kegiatan & pertanggungjawaban
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          {userRole === "Tim Satgas" ? (
            <div className="text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border flex items-center gap-2 font-medium shadow-sm h-[42px] mt-2">
              <Calendar size={16} className="text-blue-500" />
              Tahun Ajaran Aktif:{" "}
              <span className="font-bold text-blue-700">{activeTahun}</span>
            </div>
          ) : (
            <>
              <label className="text-xs font-semibold text-gray-500">
                Filter Semester
              </label>
              <div className="relative">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium min-w-[200px] shadow-sm cursor-pointer"
                >
                  <option value="Semua Semester">Semua Semester</option>
                  {tahunList.map((tahun) => (
                    <option key={tahun.id_tahunakademik} value={tahun.nama}>
                      {tahun.nama}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons for Editor */}
          {isEditor && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
              >
                <Upload size={16} />
                Upload Laporan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Section */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Daftar Laporan</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {reports.length} File
            </span>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-blue-500" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                Belum ada laporan untuk{" "}
                {selectedSemester === "Semua Semester"
                  ? "semua periode"
                  : "semester ini"}
                .
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-3 rounded-lg border cursor-pointer transition relative group
                                ${selectedReport?.id === report.id
                      ? "bg-blue-50 border-blue-200 ring-1 ring-blue-300"
                      : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-xs"
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-semibold text-gray-800 text-sm line-clamp-2">
                      {report.judul}
                    </div>
                    {report.tipeFile === "pdf" ? (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">
                        PDF
                      </span>
                    ) : (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">
                        DOCX
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {report.semester}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 border-t pt-2">
                    <span>
                      {new Date(report.createdAt).toLocaleDateString("id-ID")}
                    </span>
                    {/* Action Buttons */}
                    {(userRole === "Ketua" || userRole === "Sekretaris") && (
                      <div
                        className="flex gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openEditModal(report)}
                          className="p-1 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded"
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
          {selectedReport ? (
            <>
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Eye size={16} className="text-gray-500 shrink-0" />
                  <span className="font-semibold text-gray-700 truncate">
                    {selectedReport.judul}
                  </span>
                </div>
                <a
                  href={selectedReport.fileUrl}
                  download
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 bg-white px-3 py-1.5 rounded-md border border-blue-100 shadow-sm hover:shadow"
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
              <div className="flex-1 bg-gray-100 relative">
                {selectedReport.tipeFile === "pdf" ? (
                  <iframe
                    src={`${selectedReport.fileUrl}#toolbar=0`}
                    className="w-full h-full"
                    title="Report Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <FileText size={48} className="text-blue-300 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      Preview tidak tersedia untuk DOCX
                    </h4>
                    <p className="text-sm text-gray-500 max-w-xs mb-6">
                      Silakan unduh file untuk melihat isinya secara lengkap
                      menggunakan Microsoft Word atau aplikasi sejenis.
                    </p>
                    <a
                      href={selectedReport.fileUrl}
                      download
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                    >
                      Unduh File (.docx)
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50/50">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-200 mb-4">
                <Eye size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pilih Laporan
              </h3>
              <p className="text-gray-500 max-w-sm">
                Klik salah satu laporan dari daftar di sebelah kiri untuk
                melihat preview dokumen di sini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal (Fixed Overlay) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleUpload}>
              <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">
                  {isEditMode ? "Edit Laporan" : "Upload Laporan Baru"}
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
                    Judul Laporan
                  </label>
                  <input
                    required
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Contoh: Laporan Akhir Semester Genap 2025"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <div className="relative">
                    <select
                      value={uploadSemester}
                      onChange={(e) => setUploadSemester(e.target.value)}
                      className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm bg-white transition text-black"
                    >
                      {tahunList.length === 0 && (
                        <option value="">Belum ada Tahun Akademik</option>
                      )}
                      {tahunList.map((tahun) => (
                        <option key={tahun.id_tahunakademik} value={tahun.nama}>
                          {tahun.nama}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-3 pointer-events-none text-gray-400"
                    />
                  </div>
                </div>

                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Laporan (PDF/DOCX){" "}
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
                        accept=".pdf,.docx"
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
                          Max 10MB
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
                  {isEditMode ? "Simpan Perubahan" : "Simpan Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
