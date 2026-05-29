"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import ReportDetailModal from "./ReportDetailModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

type RowProps = {
  id: string;
  nama_korban: string;
  jenis: string;
  status: string;
  prioritas: "Tinggi" | "Sedang" | "Rendah";
  tanggal: string;
  raw_id: number;
  role?: string | null;
  onRowClick: (id: number) => void;
  onReject: (id: number) => void;
  onVerify: (id: number) => void;
};

export default function ReportTable() {
  const [reports, setReports] = useState<RowProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
    confirmText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const role = localStorage.getItem("ppkpt_role");
      const email = localStorage.getItem("ppkpt_email");

      setUserRole(role);

      if (!role) {
        setError("Role tidak ditemukan, silakan login ulang.");
        setLoading(false);
        return;
      }

      // Build URL parameters
      const params = new URLSearchParams();
      params.append("role", role);
      params.append("view", "dashboard"); // Fetch only for dashboard view
      if (email) params.append("email", email);

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data laporan");
      }

      const data = await res.json();
      setReports(data.data);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedReportId(id);
    setIsModalOpen(true);
  };

  const executeVerify = async (id: number) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Diproses" }),
      });

      if (!res.ok) throw new Error("Gagal memverifikasi laporan");

      // Remove from dashboard list
      setReports((prev) => prev.filter((rpt) => rpt.raw_id !== id));
      toast.success("Berhasil memverifikasi laporan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memverifikasi laporan");
    }
  };

  const handleVerify = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Verifikasi Laporan",
      message:
        "Apakah anda yakin ingin memverifikasi laporan ini? Laporan akan dipindahkan ke Daftar Laporan.",
      onConfirm: () => executeVerify(id),
      isDestructive: false,
      confirmText: "Verifikasi",
    });
  };

  const executeReject = async (id: number) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Ditolak" }),
      });

      if (!res.ok) throw new Error("Gagal menolak laporan");

      // Update local state
      setReports((prev) =>
        prev.map((rpt) =>
          rpt.raw_id === id ? { ...rpt, status: "Ditolak" } : rpt,
        ),
      );
      toast.success("Berhasil menolak laporan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbaharui status laporan");
    }
  };

  const handleReject = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Tolak Laporan",
      message: "Apakah anda yakin ingin menolak laporan ini?",
      onConfirm: () => executeReject(id),
      isDestructive: true,
      confirmText: "Tolak",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold mb-4 text-black">Laporan Aktif</h3>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Belum ada laporan yang tersedia.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="text-left py-2 text-black">ID Laporan</th>
                  <th className="text-left py-2 text-black">Nama Korban</th>
                  <th className="text-left text-black">Jenis Kekerasan</th>
                  <th className="text-left text-black">Status</th>
                  <th className="text-left text-black">Prioritas</th>
                  <th className="text-left text-black">Tanggal</th>
                  {userRole !== "Tim Satgas" && (
                    <th className="text-center text-black">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {reports.map((rpt) => (
                  <Row
                    key={rpt.raw_id}
                    {...rpt}
                    role={userRole}
                    onRowClick={handleRowClick}
                    onVerify={handleVerify}
                    onReject={handleReject}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportId={selectedReportId}
      />

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        isDestructive={confirmState.isDestructive}
        confirmText={confirmState.confirmText}
      />
    </>
  );
}

const Row = ({
  id,
  nama_korban,
  jenis,
  status,
  prioritas,
  tanggal,
  raw_id,
  role,
  onRowClick,
  onVerify,
  onReject,
}: RowProps) => {
  const router = useRouter();
  const priorityColor = {
    Tinggi: "text-red-600",
    Sedang: "text-orange-500",
    Rendah: "text-green-600",
  };

  const statusColor = {
    // Masuk:
    //   "text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium",
    Direview:
      "text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium",
    Verifikasi:
      "text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-xs font-medium",
    Diproses:
      "text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-xs font-medium",
    Investigasi:
      "text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-medium",
    Selesai:
      "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium",
    Ditolak:
      "text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium",
  };

  // Safe mapping for status style
  const statusBadges =
    statusColor[status as keyof typeof statusColor] || "text-gray-600";

  return (
    <tr
      onClick={() => onRowClick(raw_id)}
      className="border-b last:border-none hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <td className="py-3 text-blue-600 font-medium">{id}</td>
      <td className="text-black">{nama_korban}</td>
      <td className="text-black">{jenis}</td>
      <td className="py-3">
        <span className={statusBadges}>{status}</span>
      </td>
      <td className={priorityColor[prioritas] || "text-gray-600"}>
        ● {prioritas}
      </td>
      <td className="text-black">{tanggal}</td>
      {role !== "Tim Satgas" && (
        <td className="py-3 flex gap-2 justify-center">
          {status !== "Ditolak" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVerify(raw_id);
                }}
                className="bg-blue-50 text-blue-600 active:bg-blue-100 hover:bg-blue-100 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              >
                Verifikasi
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(raw_id);
                }}
                className="bg-red-50 text-red-600 active:bg-red-100 hover:bg-red-100 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              >
                Tolak
              </button>
            </>
          )}
          {status === "Ditolak" && (
            <span className="text-gray-400 text-xs italic"></span>
          )}
        </td>
      )}
    </tr>
  );
};
