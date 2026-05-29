"use client";

import { useState, useEffect } from "react";
import { Book, Download, FileText, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Panduan {
    id_panduan: number;
    judul: string;
    file_url: string;
    createdAt: string;
}

export const dynamic = 'force-dynamic';

export default function PublicPanduanPage() {
    const [panduans, setPanduans] = useState<Panduan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPanduan, setSelectedPanduan] = useState<Panduan | null>(null);

    useEffect(() => {
        fetchPanduan();
    }, []);

    const fetchPanduan = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/panduan?kategori=Publik");
            if (res.ok) {
                const json = await res.json();
                setPanduans(json.data || []);
            }
        } catch (err) {
            console.error("Gagal mengambil data panduan", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (url: string, title: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = title;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />

            <div className="pt-[120px] pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-[#245399]">
                            <Book className="w-8 h-8 text-[#EDA60E]" /> Panduan Sistem
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Dokumentasi dan petunjuk penggunaan sistem pelaporan Universitas Atma Jaya Yogyakarta.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List Section */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-700">Daftar Panduan</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {panduans.length} File
                            </span>
                        </div>

                        <div className="overflow-y-auto flex-1 p-2 space-y-2">
                            {loading ? (
                                <div className="text-center p-8 text-gray-500 text-sm">Memuat data...</div>
                            ) : panduans.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    Belum ada panduan sistem yang diunggah.
                                </div>
                            ) : (
                                panduans.map((p) => (
                                    <div
                                        key={p.id_panduan}
                                        onClick={() => setSelectedPanduan(p)}
                                        className={`p-3 rounded-lg border cursor-pointer transition relative group ${selectedPanduan?.id_panduan === p.id_panduan
                                            ? "bg-blue-50 border-blue-200 ring-1 ring-blue-300"
                                            : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-semibold text-gray-800 text-sm line-clamp-2">
                                                {p.judul}
                                            </div>
                                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">
                                                PDF
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 border-t pt-2">
                                            <span>
                                                {new Date(p.createdAt).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                        {selectedPanduan ? (
                            <>
                                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Eye className="w-4 h-4 text-gray-500 shrink-0" />
                                        <span className="font-semibold text-gray-700 truncate min-w-0">
                                            {selectedPanduan.judul}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(selectedPanduan.file_url, selectedPanduan.judul)}
                                        className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 bg-white px-3 py-1.5 rounded-md border border-blue-100 shadow-sm hover:shadow"
                                    >
                                        <Download className="w-3 h-3" />
                                        Download
                                    </button>
                                </div>
                                <div className="flex-1 bg-gray-100 relative">
                                    <iframe
                                        src={`${selectedPanduan.file_url}#toolbar=0&navpanes=0`}
                                        className="absolute top-0 left-0 w-full h-full border-0"
                                        title={selectedPanduan.judul}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50/50">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-200 mb-4">
                                    <Eye className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Pilih Panduan
                                </h3>
                                <p className="text-gray-500 max-w-sm">
                                    Klik salah satu panduan dari daftar di sebelah kiri untuk melihat preview dokumen di sini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
