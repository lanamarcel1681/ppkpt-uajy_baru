"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Save,
  MessageSquare,
  Download,
  UserPlus,
  FileText,
  Eye,
  Send,
  Upload,
  Image,
  Music,
  Video,
  ExternalLink,
  Scale,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import AssignTeamModal from "@/components/dashboard/AssignTeamModal";
import UploadBAPModal from "@/components/dashboard/UploadBAPModal";

// Tipe Data Laporan
type LaporanDetail = {
  id: string;
  raw_id: number;
  jenisKekerasan: string;
  deskripsi: string;
  pelapor: string;
  nama_korban: string;
  nama_terlapor?: string;
  status: string;
  prioritas: string;
  tanggal: string;
  lokasi: string;
  saksi: string;
  bukti: string;
  buktiUrl?: string;
  linkVideo?: string;
  kronologi?: string;
  hasAssignedTeam?: boolean;
  assignedTeam?: { id_pengurus: number; nama: string; posisi: string }[];
  fakultas_pelapor?: string;
  no_hp?: string;
  updatedAt?: string;
  sanksi?: string;
  keterangan_sanksi?: string;
  waktu_diproses?: string;
  tenggat_waktu?: string;
  jumlah_perpanjangan?: number;
  logs?: { date: string; description: string }[];
};

type Catatan = {
  id_catatan: number;
  isi_catatan: string;
  penulis_nama: string;
  penulis_role: string;
  createdAt: string;
};

export default function DetailLaporanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [laporan, setLaporan] = useState<LaporanDetail | null>(null);
  const [catatan, setCatatan] = useState<Catatan[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [bapDocuments, setBapDocuments] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedSanksi, setSelectedSanksi] = useState("");
  const [selectedKeteranganSanksi, setSelectedKeteranganSanksi] = useState("");

  useEffect(() => {
    if (laporan) {
      setSelectedStatus(laporan.status);
      setSelectedPriority(laporan.prioritas);
      setSelectedSanksi(laporan.sanksi || "");
      setSelectedKeteranganSanksi(laporan.keterangan_sanksi || "");
    }
  }, [laporan]);

  const handleSaveUpdate = async () => {
    if (!id || !selectedStatus) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          prioritas: selectedPriority,
          ...(selectedStatus === "Selesai" && {
            sanksi: selectedSanksi,
            keterangan_sanksi: selectedKeteranganSanksi,
          }),
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui status");

      // Refetch report data to update timeline and UI
      const updatedRes = await fetch(`/api/reports/${id}`);
      const updatedData = await updatedRes.json();
      setLaporan(updatedData);

      toast.success("Status berhasil diperbarui");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendDeadline = async () => {
    if (!id || !laporan) return;
    if (
      !confirm(
        "Apakah Anda yakin ingin memperpanjang tenggat waktu laporan ini?",
      )
    )
      return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/reports/${id}/extend`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal memperpanjang tenggat waktu");
      }

      // Refetch report data to update UI
      const updatedRes = await fetch(`/api/reports/${id}`);
      const updatedData = await updatedRes.json();
      setLaporan(updatedData);

      toast.success(data.message);
    } catch (error: any) {
      console.error("Error extending deadline:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUserRole(localStorage.getItem("ppkpt_role"));
  }, []);

  // Fetch Report Detail
  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/reports/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil detail laporan");
        const data = await res.json();
        setLaporan(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [catatan]);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      // Notes API expects ID (numeric usually)
      if (!id || isNaN(Number(id))) return;

      try {
        const res = await fetch(`/api/laporan/${id}/catatan`);
        if (res.ok) {
          const data = await res.json();
          setCatatan(data);
        }
      } catch (error) {
        console.error("Failed to fetch notes", error);
      }
    };

    if (id) fetchNotes();
  }, [id]);

  const fetchBAPDocuments = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/reports/${id}/bap`);
      if (res.ok) {
        const data = await res.json();
        setBapDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch BAP documents", err);
    }
  };

  useEffect(() => {
    fetchBAPDocuments();
  }, [id]);

  const handleSendNote = async () => {
    if (!newMessage.trim()) return;

    // Optimistic update
    const tempId = Date.now();
    const newNoteObj = {
      id_catatan: tempId,
      isi_catatan: newMessage,
      penulis_nama: localStorage.getItem("ppkpt_name") || "Admin",
      penulis_role: localStorage.getItem("ppkpt_role") || "Admin",
      createdAt: new Date().toISOString(),
    };

    setCatatan([...catatan, newNoteObj]);
    setNewMessage("");

    // If real ID, save to DB
    if (!isNaN(parseInt(id))) {
      try {
        await fetch(`/api/laporan/${id}/catatan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isi_catatan: newNoteObj.isi_catatan,
            penulis_nama: newNoteObj.penulis_nama,
            penulis_role: newNoteObj.penulis_role,
          }),
        });
      } catch (err) {
        console.error("Failed to save note", err);
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-gray-500">
          Memuat detail laporan...
        </div>
      </DashboardLayout>
    );
  }

  if (!laporan) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-500">
          Laporan tidak ditemukan.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Detail Laporan</h1>
            <p className="text-sm text-gray-500">{laporan.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Info) */}
          <div
            className={`${laporan.status === "Ditolak" ? "lg:col-span-3" : "lg:col-span-2"} space-y-6`}
          >
            {/* Informasi Laporan Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-blue-600 mb-6">
                Informasi Laporan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Jenis Kekerasan
                  </label>
                  <p className="font-medium text-gray-900">
                    {laporan.jenisKekerasan}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Tanggal Laporan
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="font-medium">{laporan.tanggal}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Pelapor
                  </label>
                  <div className="flex items-start gap-2 text-gray-900">
                    <User size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="font-medium block">
                        {laporan.pelapor}
                      </span>
                      <span className="text-sm text-gray-500">
                        {laporan.fakultas_pelapor}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Lokasi Kejadian
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="font-medium">{laporan.lokasi}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs text-gray-400 block mb-2">
                  Deskripsi Kejadian
                </label>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm leading-relaxed">
                  {laporan.deskripsi}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Saksi
                  </label>
                  <p className="font-medium text-gray-900">{laporan.saksi}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-2">
                    Bukti
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {/* Link Video */}
                    {laporan.linkVideo && (
                      <a
                        href={laporan.linkVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                        title="Buka Video Bukti"
                      >
                        <Video size={14} />
                        Video
                      </a>
                    )}

                    {/* File Attachments */}
                    {laporan.buktiUrl
                      ? (() => {
                          let files: string[] = [];
                          try {
                            // Try parse JSON, fallback to single string
                            const parsed = JSON.parse(laporan.buktiUrl);
                            if (Array.isArray(parsed)) {
                              files = parsed;
                            } else {
                              files = [laporan.buktiUrl];
                            }
                          } catch (e) {
                            files = [laporan.buktiUrl];
                          }

                          return files.map((url, idx) => {
                            const ext = url.split(".").pop()?.toLowerCase();
                            let Icon = FileText;
                            let typeLabel = "Dokumen";

                            if (
                              ["jpg", "jpeg", "png", "gif", "webp"].includes(
                                ext || "",
                              )
                            ) {
                              Icon = Image;
                              typeLabel = "Gambar";
                            } else if (
                              ["mp3", "wav", "ogg", "m4a"].includes(ext || "")
                            ) {
                              Icon = Music;
                              typeLabel = "Audio";
                            } else if (["pdf"].includes(ext || "")) {
                              Icon = FileText;
                              typeLabel = "PDF";
                            } else if (["doc", "docx"].includes(ext || "")) {
                              Icon = FileText;
                              typeLabel = "Word";
                            }

                            const fileName =
                              url.split("/").pop()?.split("?")[0] ||
                              `Bukti ${idx + 1}`;
                            const decodedFileName =
                              decodeURIComponent(fileName);

                            return (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                                title={decodedFileName}
                              >
                                <Icon size={14} />
                                {typeLabel}
                              </a>
                            );
                          });
                        })()
                      : !laporan.linkVideo && (
                          <span className="text-sm text-gray-500">
                            Tidak ada bukti
                          </span>
                        )}
                  </div>
                </div>
              </div>

              {(laporan.sanksi || laporan.keterangan_sanksi) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1">
                    <Scale size={14} className="text-gray-400" />
                    Sanksi
                  </label>
                  <p className="font-medium text-gray-900">
                    {laporan.keterangan_sanksi && laporan.sanksi
                      ? `${laporan.keterangan_sanksi} (${laporan.sanksi})`
                      : laporan.keterangan_sanksi || laporan.sanksi}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline Penanganan Card (MOCKUP for now, logic needed later) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-blue-600 mb-6">
                Timeline Penanganan
              </h2>

              <div className="space-y-6 relative pl-2">
                {/* Vertical Line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                {/* Laporan Diterima (Base Event) */}
                <div className="flex gap-4 relative">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5 z-10 shrink-0"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">
                        {laporan.tanggal}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      Laporan diterima
                    </p>
                  </div>
                </div>

                {/* Render Logs (Chronological Order - Ascending) */}
                {laporan.logs?.map((log, index) => (
                  <div key={index} className="flex gap-4 relative">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 z-10 shrink-0 ${
                        log.description.includes("Ditolak")
                          ? "bg-red-600"
                          : "bg-blue-600"
                      }`}
                    ></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">
                          {new Date(log.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dokumentasi BAP Section */}
            {laporan.status !== "Ditolak" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
                  Dokumen BAP
                </h2>

                {bapDocuments.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Belum ada dokumen BAP yang diunggah.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bapDocuments.map((doc) => (
                      <div
                        key={doc.id_dokumen}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.nama_file}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(doc.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={doc.url_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                            title="Lihat"
                          >
                            <Eye size={16} />
                          </a>
                          <a
                            href={doc.url_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            title="Unduh"
                            download
                          >
                            <Download size={16} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Catatan Admin / Chat Box */}
            {laporan.status !== "Ditolak" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
                <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
                  Catatan & Diskusi
                </h2>

                {/* Chat Area */}
                <div
                  className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar"
                  ref={scrollRef}
                >
                  {catatan.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                      <p>Belum ada catatan.</p>
                      <p className="text-xs">
                        Mulai diskusi atau tambahkan catatan di sini.
                      </p>
                    </div>
                  ) : (
                    catatan.map((note) => (
                      <div
                        key={note.id_catatan}
                        className="flex flex-col gap-1"
                      >
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-semibold text-gray-700">
                            {note.penulis_nama}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none border border-gray-100 text-sm text-gray-700">
                          {note.isi_catatan}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input Area */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendNote();
                      }}
                      placeholder="Tulis catatan..."
                      className="flex-1 px-4 py-2 text-gray-900 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendNote}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {laporan.status !== "Ditolak" && (
              <>
                {/* Surat Card */}
                {(userRole === "Ketua" || userRole === "Sekretaris") && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-blue-600 mb-6">
                      Data Surat Rekomendasi
                    </h2>
                    <button
                      onClick={() => router.push(`/dashboard/buat_surat/${id}`)}
                      disabled={laporan.status !== "Selesai"}
                      className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        laporan.status === "Selesai"
                          ? "bg-blue-800 text-white hover:bg-blue-900"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                      }`}
                    >
                      <FileText size={18} />
                      Buat Surat
                    </button>
                    {laporan.status !== "Selesai" && (
                      <p className="text-xs text-gray-400 mt-2 text-center">
                        Tombol akan aktif setelah laporan berstatus Selesai.
                      </p>
                    )}
                  </div>
                )}

                {/* Status Laporan Card */}
                {(userRole === "Ketua" || userRole === "Sekretaris") && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-blue-600 mb-6">
                      Status Laporan
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-2 block">
                          Status
                        </label>
                        <select
                          className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          <option value="Menunggu">Menunggu</option>
                          <option value="Direview">Direview</option>
                          <option value="Diproses">Diproses</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Ditolak">Ditolak</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500 mb-2 block">
                          Prioritas
                        </label>
                        <select
                          disabled
                          className="w-full px-3 py-2 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-sm cursor-not-allowed focus:outline-none"
                          value={selectedPriority}
                          onChange={(e) => setSelectedPriority(e.target.value)}
                        >
                          <option value="Tinggi">Tinggi</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Rendah">Rendah</option>
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1 italic">
                          Prioritas dihitung secara otomatis berdasarkan umur
                          laporan.
                        </p>
                      </div>

                      {selectedStatus === "Selesai" && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-500 mb-2 block">
                              Sanksi
                            </label>
                            <select
                              className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={selectedSanksi}
                              onChange={(e) =>
                                setSelectedSanksi(e.target.value)
                              }
                            >
                              <option value="" disabled>
                                Pilih Sanksi
                              </option>
                              <option value="Ringan">Ringan</option>
                              <option value="Sedang">Sedang</option>
                              <option value="Berat">Berat</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500 mb-2 block">
                              Keterangan Sanksi
                            </label>
                            <textarea
                              className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={selectedKeteranganSanksi}
                              onChange={(e) =>
                                setSelectedKeteranganSanksi(e.target.value)
                              }
                              placeholder="Masukkan keterangan sanksi..."
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleSaveUpdate}
                        className="w-full mt-4 bg-blue-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save size={16} />
                        Simpan Perubahan
                      </button>

                      {laporan.status === "Diproses" &&
                        laporan.waktu_diproses && (
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <label className="text-sm font-semibold text-gray-900 mb-3 block flex items-center gap-2">
                              <Calendar size={16} className="text-blue-600" />
                              Tenggat Waktu Pengerjaan
                            </label>
                            <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">
                                  Batas Waktu:
                                </span>
                                <span className="text-sm font-bold text-orange-700">
                                  {laporan.tenggat_waktu
                                    ? new Date(
                                        laporan.tenggat_waktu,
                                      ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  Diperpanjang:
                                </span>
                                <span className="text-xs font-semibold text-gray-700">
                                  {laporan.jumlah_perpanjangan || 0} / 2 kali
                                </span>
                              </div>
                            </div>

                            {(() => {
                              // Calculate properties for the button state
                              let isExtendable = false;
                              let disableReason = "";

                              if ((laporan.jumlah_perpanjangan || 0) >= 2) {
                                disableReason =
                                  "Maksimal perpanjangan telah tercapai";
                              } else if (laporan.tenggat_waktu) {
                                const now = new Date();
                                const deadline = new Date(
                                  laporan.tenggat_waktu,
                                );
                                const timeDiffMs =
                                  deadline.getTime() - now.getTime();
                                const diffDays = Math.ceil(
                                  timeDiffMs / (1000 * 60 * 60 * 24),
                                );

                                if (diffDays > 7) {
                                  disableReason = `Hanya dapat diperpanjang H-7 (sisa: ${diffDays} hari)`;
                                } else {
                                  isExtendable = true;
                                }
                              }

                              return (
                                <div className="space-y-2">
                                  <button
                                    onClick={handleExtendDeadline}
                                    disabled={!isExtendable}
                                    className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                                      isExtendable
                                        ? "bg-orange-600 text-white hover:bg-orange-700"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                    }`}
                                  >
                                    <Calendar size={16} />
                                    Perpanjang Tenggat
                                  </button>
                                  {!isExtendable && (
                                    <p className="text-[10px] text-gray-400 text-center">
                                      {disableReason}
                                    </p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Aksi Cepat Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-blue-600 mb-6">
                    Aksi Cepat
                  </h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Upload size={18} className="text-gray-400" />
                      Upload BAP
                    </button>
                    {(userRole === "Ketua" || userRole === "Sekretaris") &&
                      (!laporan.hasAssignedTeam ? (
                        <button
                          onClick={() => setIsAssignModalOpen(true)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <UserPlus size={18} className="text-gray-400" />
                          Assign ke Tim
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-700">
                            <div className="flex items-center gap-2 mb-3 text-green-700 font-medium">
                              <UserPlus size={18} />
                              Tim Sudah Ditugaskan
                            </div>
                            <div className="space-y-3">
                              <div>
                                <p className="font-semibold text-xs text-blue-700 uppercase mb-1">
                                  Tim Korban
                                </p>
                                <ul className="list-disc pl-4 text-xs space-y-1">
                                  {laporan.assignedTeam
                                    ?.filter((t) => t.posisi === "Tim Korban")
                                    .map((t, idx) => (
                                      <li key={idx} className="text-gray-700">
                                        {t.nama}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-semibold text-xs text-red-700 uppercase mb-1">
                                  Tim Pelaku
                                </p>
                                <ul className="list-disc pl-4 text-xs space-y-1">
                                  {laporan.assignedTeam
                                    ?.filter((t) => t.posisi === "Tim Pelaku")
                                    .map((t, idx) => (
                                      <li key={idx} className="text-gray-700">
                                        {t.nama}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsAssignModalOpen(true)}
                            className="w-full px-4 py-2.5 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            Edit Tim Assign
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Kontak Pelapor Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xs font-semibold text-blue-600 uppercase mb-4">
                    Kontak Pelapor
                  </h2>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      No. Telepon:{" "}
                      <span className="text-gray-600 font-normal">
                        {laporan.no_hp || "-"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      * Informasi kontak dijaga kerahasiaannya
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AssignTeamModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        reportId={id}
        initialKorbanIds={
          laporan.assignedTeam
            ?.filter((t) => t.posisi === "Tim Korban")
            .map((t) => t.id_pengurus) || []
        }
        initialPelakuIds={
          laporan.assignedTeam
            ?.filter((t) => t.posisi === "Tim Pelaku")
            .map((t) => t.id_pengurus) || []
        }
        onSuccess={async () => {
          toast.success("Tim berhasil disimpan!");
          setIsAssignModalOpen(false);
          // Refetch report data to show updated assigned team
          try {
            const res = await fetch(`/api/reports/${id}`);
            if (res.ok) {
              const data = await res.json();
              setLaporan(data);
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />
      <UploadBAPModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        reportId={id}
        onUploadSuccess={fetchBAPDocuments}
      />
    </DashboardLayout>
  );
}
