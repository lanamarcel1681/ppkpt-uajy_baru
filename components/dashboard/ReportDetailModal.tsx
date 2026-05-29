"use client";

import { useEffect, useState } from "react";
import {
  X,
  FileText,
  MapPin,
  Users,
  Calendar,
  AlertTriangle,
  File,
  Phone,
  Image,
  Music,
  Video,
  ExternalLink,
  Scale,
} from "lucide-react";

type ReportDetail = {
  id: string;
  raw_id: number;
  jenisKekerasan: string;
  deskripsi: string;
  pelapor: string;
  no_hp: string;
  nama_korban: string;
  status: string;
  prioritas: string;
  tanggal: string;
  lokasi: string;
  saksi: string;
  bukti: string;
  buktiUrl: string | null;
  linkVideo: string | null;
  kronologi: string;
  sanksi?: string | null;
  keterangan_sanksi?: string | null;
};

type Props = {
  reportId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ReportDetailModal({
  reportId,
  isOpen,
  onClose,
}: Props) {
  const [data, setData] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && reportId) {
      setLoading(true);
      setError("");
      setData(null);

      fetch(`/api/reports/${reportId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal memuat detail laporan");
          return res.json();
        })
        .then((data) => setData(data))
        .catch((err) => {
          console.error(err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, reportId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <File className="w-5 h-5 text-blue-600" /> Detail Laporan
            </h2>
            {data && <p className="text-sm text-gray-500 mt-1">{data.id}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg border border-red-100">
              <AlertTriangle className="mx-auto mb-2 w-8 h-8" />
              <p>{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Status Section */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    data.status === "Ditolak"
                      ? "bg-red-50 text-red-600"
                      : data.status === "Selesai"
                        ? "bg-green-50 text-green-600"
                        : data.status === "Verifikasi" ||
                            data.status === "Diproses"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {data.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    data.prioritas === "Tinggi"
                      ? "bg-red-50 text-red-600"
                      : data.prioritas === "Sedang"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-green-50 text-green-600"
                  }`}
                >
                  Prioritas {data.prioritas}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Calendar size={14} /> {data.tanggal}
                </span>
              </div>

              {/* People Involved */}
              <div
                className={`grid gap-4 ${data.pelapor === data.nama_korban ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
              >
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    {data.pelapor === data.nama_korban
                      ? "Pelapor (Korban)"
                      : "Pelapor"}
                  </label>
                  <p className="font-semibold text-gray-900 text-lg">
                    {data.pelapor}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <Phone className="w-3 h-3" />
                    {data.no_hp || "-"}
                  </div>
                </div>

                {data.pelapor !== data.nama_korban && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                      Korban
                    </label>
                    <p className="font-semibold text-gray-900 text-lg">
                      {data.nama_korban}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Incident Details */}
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <AlertTriangle size={16} className="text-orange-500" />{" "}
                    Jenis Kekerasan
                  </h3>
                  <p className="text-gray-700 bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                    {data.jenisKekerasan}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <MapPin size={16} className="text-blue-500" /> Lokasi
                      Kejadian (TKP)
                    </h3>
                    <p className="text-gray-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                      {data.lokasi}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Users size={16} className="text-purple-500" /> Saksi
                    </h3>
                    <p className="text-gray-700 bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                      {data.saksi}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <FileText size={16} className="text-gray-500" /> Kronologi
                    Kejadian
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {data.kronologi}
                  </div>
                </div>

                {(data.sanksi || data.keterangan_sanksi) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Scale size={16} className="text-red-500" /> Sanksi
                    </h3>
                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {data.keterangan_sanksi && data.sanksi
                        ? `${data.keterangan_sanksi} (${data.sanksi})`
                        : data.keterangan_sanksi || data.sanksi}
                    </div>
                  </div>
                )}

                {/* Bagian Bukti-Bukti */}
                {(data.buktiUrl || data.linkVideo) && (
                  <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                      <File className="w-4 h-4 text-blue-600" /> Bukti Lampiran
                    </h3>

                    {/* 1. Link Video (Google Drive) */}
                    {data.linkVideo && (
                      <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <Video size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Bukti Video
                            </p>
                            <p className="text-xs text-gray-500">
                              Link Google Drive / Cloud
                            </p>
                          </div>
                        </div>
                        <a
                          href={data.linkVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition flex items-center gap-1.5"
                        >
                          Lihat Bukti <ExternalLink size={12} />
                        </a>
                      </div>
                    )}

                    {/* 2. File Attachments */}
                    {data.buktiUrl && (
                      <div className="space-y-2">
                        {(() => {
                          let files: string[] = [];
                          try {
                            if (data.buktiUrl) {
                              // Sometimes it's stored as a JSON string of an array
                              const parsed = JSON.parse(data.buktiUrl);
                              if (Array.isArray(parsed)) {
                                files = parsed;
                              } else {
                                files = [data.buktiUrl];
                              }
                            }
                          } catch (e) {
                            // If it fails to parse (e.g., plain string or comma separated)
                            if (data.buktiUrl && data.buktiUrl.includes(",")) {
                              // Try splitting by comma
                              // Remove brackets if it was a malformed array string like '["url1","url2"]' that somehow failed JSON.parse
                              const cleaned = data.buktiUrl
                                .replace(/^\[|\]$/g, "")
                                .replace(/"/g, "");
                              files = cleaned
                                .split(",")
                                .map((u) => u.trim())
                                .filter((u) => u);
                            } else if (data.buktiUrl) {
                              files = [data.buktiUrl];
                            }
                          }

                          return files.map((url, idx) => {
                            // Tentukan Icon berdasarkan ekstensi
                            const ext = url.split(".").pop()?.toLowerCase();
                            let Icon = FileText;
                            let typeLabel = "Dokumen";
                            let iconColor = "text-gray-600 bg-gray-100";

                            if (
                              ["jpg", "jpeg", "png", "gif", "webp"].includes(
                                ext || "",
                              )
                            ) {
                              Icon = Image;
                              typeLabel = "Gambar";
                              iconColor = "text-purple-600 bg-purple-100";
                            } else if (
                              ["mp3", "wav", "ogg", "m4a"].includes(ext || "")
                            ) {
                              Icon = Music;
                              typeLabel = "Audio";
                              iconColor = "text-pink-600 bg-pink-100";
                            } else if (["pdf"].includes(ext || "")) {
                              Icon = FileText;
                              typeLabel = "PDF";
                              iconColor = "text-red-600 bg-red-100";
                            } else if (["doc", "docx"].includes(ext || "")) {
                              Icon = FileText;
                              typeLabel = "Word";
                              iconColor = "text-blue-600 bg-blue-100";
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
                                className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div
                                    className={`p-2 rounded-lg ${iconColor} flex-shrink-0`}
                                  >
                                    <Icon size={20} />
                                  </div>
                                  <div className="min-w-0">
                                    <p
                                      className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors"
                                      title={decodedFileName}
                                    >
                                      {decodedFileName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {typeLabel}
                                    </p>
                                  </div>
                                </div>
                                <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                                  <ExternalLink size={16} />
                                </div>
                              </a>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
