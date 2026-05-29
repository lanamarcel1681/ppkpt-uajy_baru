"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Eye,
  MoreVertical,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAcademicYear } from "@/lib/academicYear";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

// Tipe data untuk laporan
// Tipe data untuk laporan
interface Laporan {
  id: string;
  raw_id: number;
  jenisKekerasan: string;
  deskripsi: string;
  pelapor: string; // Ini akan diisi nama korban
  status: "Menunggu" | "Direview" | "Diproses" | "Selesai" | "Ditolak";
  prioritas: "Tinggi" | "Sedang" | "Rendah";
  tanggal: string;
  lokasi?: string;
  semester: string;
}

// Tipe props untuk LaporanTable
interface LaporanTableProps {
  data?: Laporan[]; // Data opsional dari parent (jika parent sudah fetch)
  filters?: {
    searchTerm?: string;
    status?: string;
    prioritas?: string;
    sortBy?: string;
  };
  onViewLaporan?: (id: string) => void;
  onEditLaporan?: (id: string) => void;
  onDeleteLaporan?: (id: string) => void;
}

// Komponen Badge Status
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case "Menunggu":
        return {
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          icon: <Clock size={12} />,
        };
      case "Direview":
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: <AlertCircle size={12} />,
        };
      case "Diproses":
        return {
          bgColor: "bg-purple-50",
          textColor: "text-purple-700",
          borderColor: "border-purple-200",
          icon: <FileText size={12} />,
        };
      case "Selesai":
        return {
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          icon: <CheckCircle size={12} />,
        };
      case "Ditolak":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <AlertCircle size={12} />,
        };
      default:
        return {
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: null,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {config.icon}
      <span className="text-xs font-medium">{status}</span>
    </div>
  );
}

// Komponen Badge Prioritas
function PrioritasBadge({ prioritas }: { prioritas: string }) {
  const getPrioritasConfig = () => {
    switch (prioritas) {
      case "Tinggi":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <AlertTriangle size={12} />,
        };
      case "Sedang":
        return {
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          borderColor: "border-orange-200",
          icon: <AlertTriangle size={12} className="opacity-70" />,
        };
      case "Rendah":
        return {
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          icon: null,
        };
      default:
        return {
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: null,
        };
    }
  };

  const config = getPrioritasConfig();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {config.icon}
      <span className="text-xs font-medium">{prioritas}</span>
    </div>
  );
}

export default function LaporanTable({
  data: propData,
  filters = {},
  onViewLaporan,
  onEditLaporan,
  onDeleteLaporan,
}: LaporanTableProps) {
  const [fetchedData, setFetchedData] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Computed Academic Year using current mathematical date
  const currentAcademicYear = getAcademicYear(new Date());

  // State for Academic Year Dropdown Filter (For Ketua/Sekretaris only)
  const [selectedSemesterFilter, setSelectedSemesterFilter] =
    useState<string>("Semua Semester");

  // No need to fetch from /api/tahun-akademik DB anymore, we use math logic.
  const [activeTahun, setActiveTahun] = useState<string>(currentAcademicYear);

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

  // Fetch data on mount if no propData
  useEffect(() => {
    if (propData) {
      setFetchedData(propData);
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const role = localStorage.getItem("ppkpt_role");
        const email = localStorage.getItem("ppkpt_email");
        setUserRole(role);

        if (!role) {
          setError("Role tidak ditemukan.");
          setLoading(false);
          return;
        }

        const params = new URLSearchParams();
        params.append("role", role);
        params.append("view", "list"); // Fetch for list view (verified only)
        if (email) params.append("email", email);

        const res = await fetch(`/api/reports?${params.toString()}`);
        if (!res.ok) throw new Error("Gagal mengambil data");

        const result = await res.json();
        const mappedData = result.data.map((item: any) => ({
          id: item.id,
          raw_id: item.raw_id,
          jenisKekerasan: item.jenis,
          deskripsi: "Deskripsi belum tersedia di list view",
          pelapor: item.nama_korban,
          status: item.status,
          prioritas: item.prioritas,
          tanggal: item.tanggal,
          semester: item.semester, // Now returned from our updated API
          lokasi: "-",
        }));
        setFetchedData(mappedData);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data laporan.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [propData]);

  // Combine fetchedData with logic (use fetchedData instead of data prop directly)
  const dataToUse = propData || fetchedData;

  // Filter dan sort data berdasarkan props
  const filteredAndSortedData = useMemo(() => {
    let result = [...dataToUse];

    // Filter berdasarkan search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(term) ||
          item.jenisKekerasan.toLowerCase().includes(term) ||
          item.pelapor.toLowerCase().includes(term) ||
          item.deskripsi.toLowerCase().includes(term),
      );
    }

    // Filter berdasarkan status
    if (filters.status && filters.status !== "Semua") {
      result = result.filter((item) => item.status === filters.status);
    }

    // Filter berdasarkan prioritas
    if (filters.prioritas && filters.prioritas !== "Semua") {
      result = result.filter((item) => item.prioritas === filters.prioritas);
    }

    // MATHEMATICAL ACADEMIC YEAR FILTERING RULES
    if (userRole === "Tim Satgas") {
      // Satgas ONLY sees reports from the CURRENT active mathematical semester
      result = result.filter((item) => item.semester === currentAcademicYear);
    } else if (userRole === "Ketua" || userRole === "Sekretaris" || userRole === "Admin" || userRole === "Tim Satgas") {
      // Admin sees all, but can use the dynamic semester filter UI
      if (selectedSemesterFilter !== "Semua Semester") {
        result = result.filter(
          (item) => item.semester === selectedSemesterFilter,
        );
      }
    }

    // Sort data
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "terbaru":
          result.sort(
            (a, b) =>
              new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime(),
          );
          break;
        case "terlama":
          result.sort(
            (a, b) =>
              new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime(),
          );
          break;
        case "prioritas":
          const priorityOrder = { Tinggi: 3, Sedang: 2, Rendah: 1 };
          result.sort(
            (a, b) => priorityOrder[b.prioritas] - priorityOrder[a.prioritas],
          );
          break;
        case "id":
          result.sort((a, b) => a.id.localeCompare(b.id));
          break;
      }
    } else {
      // DEFAULT SORTING: Terlama / Oldest First (FIFO)
      result.sort(
        (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime(),
      );
    }

    return result;
  }, [
    dataToUse,
    filters,
    userRole,
    currentAcademicYear,
    selectedSemesterFilter,
  ]);

  // Reset pagination to page 1 whenever filters or data change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedData.length, filters, selectedSemesterFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handler untuk menu dropdown
  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const router = useRouter();

  // Handler default untuk view laporan
  const handleViewLaporan = (id: string) => {
    if (onViewLaporan) {
      onViewLaporan(id);
    } else {
      router.push(`/dashboard/daftar_Laporan/${id}`);
    }
  };

  // Handler default untuk edit laporan
  const handleEditLaporan = (id: string) => {
    if (onEditLaporan) {
      onEditLaporan(id);
    } else {
      toast.success(`Edit laporan: ${id}`);
      // Default action jika tidak ada handler dari parent
    }
    setActiveMenu(null);
  };

  const executeDelete = (id: string) => {
    toast.success(`Laporan ${id} telah dihapus`);
  };

  // Handler default untuk delete laporan
  const handleDeleteLaporan = (id: string) => {
    if (onDeleteLaporan) {
      onDeleteLaporan(id);
    } else {
      if (confirm(`Apakah Anda yakin ingin menghapus laporan ${id}?`)) {
        toast.success(`Laporan ${id} telah dihapus`);
      }
    }
    setActiveMenu(null);
  };

  // Get icon untuk pelapor
  const getPelaporIcon = (pelapor: string) => {
    if (pelapor === "Anonim") {
      return <User size={14} className="opacity-50" />;
    }
    return <User size={14} />;
  };

  if (loading && !propData) {
    return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
  }

  if (error && !propData) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-visible">
      {/* Header Info */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Laporan
            </h3>
            <p className="text-sm text-gray-600">
              Menampilkan{" "}
              <span className="font-semibold">
                {filteredAndSortedData.length}
              </span>{" "}
              dari <span className="font-semibold">{dataToUse.length}</span>{" "}
              laporan
            </p>
          </div>

          {/* Dynamic Info / Selector based on Role */}
          {userRole === "Tim Satgas" ? (
            <div className="text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border flex items-center gap-2 font-medium shadow-sm">
              <Calendar size={16} className="text-blue-500" />
              Tahun Ajaran Aktif:{" "}
              <span className="font-bold text-blue-700">{activeTahun}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">
                Filter Semester:
              </span>
              <select
                value={selectedSemesterFilter}
                onChange={(e) => setSelectedSemesterFilter(e.target.value)}
                className="bg-white border border-gray-200 text-sm font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] text-black"
              >
                <option value="Semua Semester">Semua Semester</option>
                {Array.from(new Set(dataToUse.map((r) => r.semester))).map(
                  (sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ID Laporan
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Jenis Kekerasan
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nama Korban
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Prioritas
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((laporan) => (
                <tr
                  key={laporan.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* ID Laporan */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-mono font-semibold text-gray-900">
                        {laporan.id}
                      </span>
                      {laporan.lokasi && (
                        <span className="text-xs text-gray-500 mt-1">
                          {laporan.lokasi}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Jenis Kekerasan */}
                  <td className="py-4 px-6">
                    <div className="max-w-xs">
                      <div className="font-medium text-gray-900">
                        {laporan.jenisKekerasan}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {laporan.deskripsi}
                      </div>
                    </div>
                  </td>

                  {/* Pelapor */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        {getPelaporIcon(laporan.pelapor)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {laporan.pelapor}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <StatusBadge status={laporan.status} />
                  </td>

                  {/* Prioritas */}
                  <td className="py-4 px-6">
                    <PrioritasBadge prioritas={laporan.prioritas} />
                  </td>

                  {/* Tanggal */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">
                        {laporan.tanggal}
                      </span>
                      <span className="text-xs text-gray-500">Dilaporkan</span>
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleViewLaporan(String(laporan.raw_id))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                        <span className="text-sm">Lihat</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Tidak ada laporan ditemukan
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Tidak ada laporan yang sesuai dengan filter pencarian
                      Anda. Coba ubah filter atau kata kunci pencarian.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer dengan Pagination (jika banyak data) */}
      {filteredAndSortedData.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-black">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Menampilkan{" "}
              <span className="font-semibold">
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredAndSortedData.length,
                )}
                -
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedData.length,
                )}
              </span>{" "}
              dari{" "}
              <span className="font-semibold">
                {filteredAndSortedData.length}
              </span>{" "}
              laporan
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Sebelumnya
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${currentPage === page
                        ? "bg-blue-600 text-white font-medium"
                        : "border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        isDestructive={true}
      />
    </div>
  );
}