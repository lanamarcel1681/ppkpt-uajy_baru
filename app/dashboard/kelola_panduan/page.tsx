"use client";

import { useState, useEffect } from "react";
import { Book, Download, Trash2, Upload, FileText, Plus, Eye } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface Panduan {
    id_panduan: number;
    judul: string;
    kategori: string;
    file_url: string;
    createdAt: string;
}

export default function KelolaPanduanPage() {
    const [role, setRole] = useState<string | null>(null);
    const [panduans, setPanduans] = useState<Panduan[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [judul, setJudul] = useState("");
    const [kategori, setKategori] = useState("Internal");
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

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
        const storedRole = localStorage.getItem("ppkpt_role");
        setRole(storedRole);
        fetchPanduan();
    }, []);

    const fetchPanduan = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/panduan");
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

    const handeUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !judul || !kategori) { // Updated condition
            toast.error("Judul, Kategori, dan File wajib diisi."); // Updated alert message
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("judul", judul);
        formData.append("kategori", kategori); // Append kategori
        formData.append("file", file);

        try {
            const res = await fetch("/api/panduan", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("Panduan berhasil diunggah!");
                setIsModalOpen(false);
                setJudul("");
                setKategori("Internal"); // Reset kategori
                setFile(null);
                fetchPanduan(); // refresh data
            } else {
                const json = await res.json();
                toast.error(json.message || "Gagal mengunggah file");
            }
        } catch (err) {
            console.error("Error uploading", err);
            toast.error("Terjadi kesalahan saat mengunggah file.");
        } finally {
            setIsUploading(false);
        }
    };

    const executeDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/panduan/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Panduan berhasil dihapus");
                fetchPanduan();
            } else {
                toast.error("Gagal menghapus panduan");
            }
        } catch (err) {
            console.error("Error deleting", err);
            toast.error("Terjadi kesalahan server");
        }
    };

    const handleDelete = (id: number) => {
        setConfirmState({
            isOpen: true,
            title: "Hapus Panduan",
            message: "Apakah Anda yakin ingin menghapus panduan ini? File juga akan terhapus dari server.",
            onConfirm: () => executeDelete(id),
        });
    };

    const handleView = (url: string) => {
        window.open(url, "_blank");
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
        <DashboardLayout>
            <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            <Upload className="w-6 h-6 text-blue-600" /> Kelola Panduan Sistem
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manajemen file panduan sistem (Upload dan Hapus).
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                    >
                        <Plus className="w-4 h-4" /> Upload Panduan Baru
                    </button>
                </div>

                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Memuat data...</div>
                    ) : panduans.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p>Belum ada panduan sistem yang diunggah.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Nama Panduan</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Diupload Pada</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {panduans.map((p) => (
                                    <tr key={p.id_panduan} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-gray-900 line-clamp-2 leading-tight">
                                                    {p.judul}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${p.kategori === "Publik" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                                }`}>
                                                {p.kategori === "Publik" ? "Website Depan (Publik)" : "Tim Internal"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(p.createdAt).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(p.file_url)}
                                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                                    title="Lihat File"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(p.file_url, p.judul)}
                                                    className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition"
                                                    title="Download File"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(p.id_panduan)}
                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                                                    title="Hapus Panduan"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal Upload */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-6 border-b">
                                <h2 className="text-xl text-black font-bold">Upload Panduan Sistem</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Tambahkan file dokumen (PDF) untuk dijadikan panduan tim.
                                </p>
                            </div>
                            <form onSubmit={handeUpload} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Panduan *</label>
                                    <input
                                        type="text"
                                        required
                                        value={judul}
                                        onChange={(e) => setJudul(e.target.value)}
                                        placeholder="Contoh: Panduan Pelaporan Kekerasan"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Peruntukan *</label>
                                    <select
                                        required
                                        value={kategori}
                                        onChange={(e) => setKategori(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition text-black bg-white"
                                    >
                                        <option value="Internal">Tim Internal (Admin & Satgas)</option>
                                        <option value="Publik">Pengguna Website Depan (Publik)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">File Dokumen *</label>
                                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                        <input
                                            type="file"
                                            required
                                            accept=".pdf"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setFile(e.target.files[0]);
                                                }
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                        {file ? (
                                            <p className="text-sm text-blue-600 font-medium truncate px-2">{file.name}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                <strong>Klik</strong> untuk memilih file (PDF saja)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                                    >
                                        {isUploading ? "Mengunggah..." : "Simpan & Upload"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
                }

                <ConfirmationModal
                    isOpen={confirmState.isOpen}
                    onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmState.onConfirm}
                    title={confirmState.title}
                    message={confirmState.message}
                />
            </div >
        </DashboardLayout >
    );
}
