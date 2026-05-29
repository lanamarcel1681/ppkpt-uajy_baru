import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Contoh {
    id?: number;
    isi_contoh: string;
}

interface JenisKekerasan {
    id?: number;
    judul: string;
    deskripsi: string;
    contoh: Contoh[];
}

interface KekerasanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData?: JenisKekerasan | null;
}

export default function KekerasanModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: KekerasanModalProps) {
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        examples: [] as string[],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                judul: initialData.judul,
                deskripsi: initialData.deskripsi,
                examples: initialData.contoh.map((c) => c.isi_contoh),
            });
        } else {
            setFormData({
                judul: "",
                deskripsi: "",
                examples: [],
            });
        }
    }, [initialData, isOpen]);

    const handleAddExample = () => {
        setFormData((prev) => ({
            ...prev,
            examples: [...prev.examples, ""],
        }));
    };

    const handleRemoveExample = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            examples: prev.examples.filter((_, i) => i !== index),
        }));
    };

    const handleExampleChange = (index: number, value: string) => {
        const newExamples = [...formData.examples];
        newExamples[index] = value;
        setFormData((prev) => ({ ...prev, examples: newExamples }));
    };

    const handleSubmit = async () => {
        if (!formData.judul || !formData.deskripsi) {
            toast.error("Mohon lengkapi judul dan deskripsi");
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-900">
                        {initialData ? "Edit Jenis Kekerasan" : "Tambah Jenis Kekerasan"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-gray-500 text-sm">
                        Edit atau tambahkan jenis kekerasan yang akan ditampilkan di
                        website.
                    </p>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Judul
                        </label>
                        <input
                            type="text"
                            value={formData.judul}
                            onChange={(e) =>
                                setFormData({ ...formData, judul: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800"
                            placeholder="Kekerasan Fisik"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            value={formData.deskripsi}
                            onChange={(e) =>
                                setFormData({ ...formData, deskripsi: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 min-h-[100px] resize-none"
                            placeholder="Deskripsi singkat..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contoh
                        </label>
                        <div className="space-y-3 mb-3">
                            {formData.examples.map((ex, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={ex}
                                        onChange={(e) => handleExampleChange(idx, e.target.value)}
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800"
                                        placeholder="Contoh kasus..."
                                    />
                                    <button
                                        onClick={() => handleRemoveExample(idx)}
                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddExample}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            <Plus size={16} /> Tambah Contoh
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
