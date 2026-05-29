
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    editData?: { id: number; nama: string } | null;
};

export default function FakultasForm({ isOpen, onClose, onSave, editData }: Props) {
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
                ? `/api/cms/fakultas/${editData.id}`
                : "/api/cms/fakultas";
            const method = editData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal menyimpan");
            }

            toast.success(editData ? "Berhasil mengupdate fakultas" : "Berhasil menambahkan fakultas");
            onSave();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Terjadi kesalahan saat menyimpan data");
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
                        {editData ? "Edit Fakultas" : "Tambah Fakultas"}
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
                            Nama Fakultas
                        </label>
                        <input
                            type="text"
                            required
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Contoh: Fakultas Teknik"
                            className="w-full px-4 py-2 border text-gray-900 rounded-xl focus:ring-2 focus:ring-[#1E4278] outline-none transition"
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
                            {loading ? "Menyimmpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
