
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    id_fakultas: number;
    editData?: { id: number; nama: string; id_fakultas: number } | null;
};

export default function ProdiForm({ isOpen, onClose, onSave, id_fakultas, editData }: Props) {
    const [nama, setNama] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setNama(editData.nama);
        } else {
            setNama("");
        }
    }, [editData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editData
                ? `/api/cms/prodi/${editData.id}`
                : "/api/cms/prodi";
            const method = editData ? "PUT" : "POST";

            const body = {
                nama,
                id_fakultas: id_fakultas, // Always rely on current faculty context or editData's faculty
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Gagal menyimpan");

            toast.success(editData ? "Berhasil mengupdate prodi" : "Berhasil menambahkan prodi");
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat menyimpan data");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-[#1E4278]">
                        {editData ? "Edit Program Studi" : "Tambah Program Studi"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nama Program Studi
                        </label>
                        <input
                            type="text"
                            required
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Contoh: Teknik Informatika"
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 text-gray-900 focus:ring-[#1E4278] outline-none transition"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl bg-[#1E4278] text-white font-medium hover:bg-blue-800 transition disabled:opacity-50"
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
