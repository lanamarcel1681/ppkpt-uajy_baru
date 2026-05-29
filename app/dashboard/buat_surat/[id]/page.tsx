"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import { ArrowLeft, FileText, Printer, Copy, Check } from "lucide-react";

type LaporanDetail = {
    id: string;
    raw_id: number;
    jenisKekerasan: string;
    kronologi: string;
    nama_terlapor?: string;
    status: string;
};

export default function BuatSuratPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [laporan, setLaporan] = useState<LaporanDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, fieldId: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => {
            setCopiedField(null);
        }, 2000);
    };

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

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-gray-500">
                    Memuat data surat...
                </div>
            </DashboardLayout>
        );
    }

    if (!laporan) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-red-500">
                    Data laporan tidak ditemukan.
                </div>
            </DashboardLayout>
        );
    }

    if (laporan.status !== "Selesai") {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-red-500 bg-white m-6 rounded-xl border border-red-200">
                    <h2 className="text-xl font-bold mb-4">Akses Ditolak</h2>
                    <p>Laporan belum selesai, tidak dapat membuat surat rekomendasi.</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                    >
                        Kembali
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Kembali</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900">Buat Surat Rekomendasi</h1>
                        <p className="text-sm text-gray-500">Berdasarkan Laporan: {laporan.id}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="text-center mb-10 border-b border-gray-200 pb-6">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                            Surat Rekomendasi Penanganan Kekerasan
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Satgas PPKPT Universitas Atma Jaya Yogyakarta
                        </p>
                    </div>

                    <div className="space-y-8 text-gray-800">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">
                                1. Identitas Terlapor
                            </h3>
                            <div className="ml-4 pl-3">
                                <div className="flex items-center justify-between w-full">
                                    <p className="flex items-center">
                                        <span className="font-medium text-gray-600 w-48 inline-block">Nama Terlapor</span>
                                        <span className="mr-2">:</span>
                                        <span className="font-semibold">{laporan.nama_terlapor || "Tidak diketahui"}</span>
                                    </p>
                                    {laporan.nama_terlapor && (
                                        <button
                                            onClick={() => handleCopy(laporan.nama_terlapor!, 'nama_terlapor')}
                                            className="flex items-center gap-1.5 p-1 text-gray-400 hover:text-blue-600 font-medium text-xs transition-colors"
                                            title="Salin Nama Terlapor"
                                        >
                                            {copiedField === 'nama_terlapor' ? (
                                                <><Check size={14} className="text-green-500" /> <span className="text-green-500">Copied</span></>
                                            ) : (
                                                <><Copy size={14} /> Copy</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">
                                2. Detail Kasus
                            </h3>
                            <div className="ml-4 pl-3 space-y-4">
                                <div className="flex items-center justify-between w-full">
                                    <p className="flex items-center">
                                        <span className="font-medium text-gray-600 w-48 inline-block shrink-0">Jenis Kekerasan</span>
                                        <span className="mr-2">:</span>
                                        <span>{laporan.jenisKekerasan}</span>
                                    </p>
                                    <button
                                        onClick={() => handleCopy(laporan.jenisKekerasan, 'jenis_kekerasan')}
                                        className="flex items-center gap-1.5 p-1 text-gray-400 hover:text-blue-600 font-medium text-xs transition-colors"
                                        title="Salin Jenis Kekerasan"
                                    >
                                        {copiedField === 'jenis_kekerasan' ? (
                                            <><Check size={14} className="text-green-500" /> <span className="text-green-500">Copied</span></>
                                        ) : (
                                            <><Copy size={14} /> Copy</>
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <p className="flex items-center">
                                        <span className="font-medium text-gray-600 w-48 inline-block shrink-0">Status Laporan</span>
                                        <span className="mr-2">:</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase">
                                            {laporan.status}
                                        </span>
                                    </p>
                                    <button
                                        onClick={() => handleCopy(laporan.status, 'status_laporan')}
                                        className="flex items-center gap-1.5 p-1 text-gray-400 hover:text-blue-600 font-medium text-xs transition-colors"
                                        title="Salin Status Laporan"
                                    >
                                        {copiedField === 'status_laporan' ? (
                                            <><Check size={14} className="text-green-500" /> <span className="text-green-500">Copied</span></>
                                        ) : (
                                            <><Copy size={14} /> Copy</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">
                                3. Kronologi Kejadian
                            </h3>
                            <div className="ml-4 pl-3">
                                <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-sm leading-relaxed whitespace-pre-wrap min-h-[150px] relative">
                                    <div className="absolute top-4 right-4 text-right">
                                        <button
                                            onClick={() => handleCopy(laporan.kronologi, 'kronologi')}
                                            className="flex items-center gap-1.5 p-1 text-gray-400 hover:text-blue-600 font-medium text-xs transition-colors"
                                            title="Salin Kronologi Kejadian"
                                        >
                                            {copiedField === 'kronologi' ? (
                                                <><Check size={14} className="text-green-500" /> <span className="text-green-500">Copied</span></>
                                            ) : (
                                                <><Copy size={14} /> Copy</>
                                            )}
                                        </button>
                                    </div>
                                    <div className="pt-8">
                                        {laporan.kronologi}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                className="px-6 py-2.5 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <FileText size={16} />
                                Simpan & Terbitkan
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
