"use client";

import { useState, useEffect } from "react";
import { X, Upload, FileText, Trash2, Download, ExternalLink, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type BAPDocument = {
    id_dokumen: number;
    nama_file: string;
    url_file: string;
    createdAt: string;
    keterangan?: string;
};

type UploadBAPModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reportId: string;
    onUploadSuccess?: () => void;
};

export default function UploadBAPModal({
    isOpen,
    onClose,
    reportId,
    onUploadSuccess,
}: UploadBAPModalProps) {
    const [documents, setDocuments] = useState<BAPDocument[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && reportId) {
            fetchDocuments();
            setSelectedFiles([]);
            setError(null);
        }
    }, [isOpen, reportId]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reports/${reportId}/bap`);
            if (!res.ok) throw new Error("Gagal mengambil dokumen");
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (err: any) {
            console.error(err);
            // setError("Gagal memuat dokumen."); 
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        const allowedExtensions = ['pdf', 'doc', 'docx'];
        const isValid = selectedFiles.every(file => {
            const ext = file.name.split('.').pop()?.toLowerCase();
            return ext && allowedExtensions.includes(ext);
        });

        if (!isValid) {
            toast.error("Hanya file PDF dan Word (.doc/.docx) yang diizinkan");
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("file", file);
        });

        try {
            const res = await fetch(`/api/reports/${reportId}/bap`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Gagal mengupload file");

            await fetchDocuments();
            setSelectedFiles([]);
            toast.success("BAP berhasil diunggah!");
            if (onUploadSuccess) onUploadSuccess();
        } catch (err: any) {
            toast.error(err.message || "Terjadi kesalahan saat upload.");
            setError(err.message || "Terjadi kesalahan saat upload.");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Upload size={24} className="text-blue-600" />
                        Upload & Lihat BAP
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    {/* Upload Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih File BAP (PDF/Docx)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                            <button
                                onClick={handleUpload}
                                disabled={uploading || selectedFiles.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                Upload
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
