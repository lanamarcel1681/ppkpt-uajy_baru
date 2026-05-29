import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

interface LayananFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

export default function LayananForm({
    initialData,
    onSave,
    onCancel,
    loading,
}: LayananFormProps) {
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        iconBg: "bg-[#245399]",
        icon: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                desc: initialData.desc,
                iconBg: initialData.iconBg,
                icon: initialData.icon,
            });
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                    {initialData ? "Edit Layanan" : "Tambah Layanan Baru"}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-500"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Judul */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Layanan
                </label>
                <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800"
                    placeholder="Contoh: Laporan Anonim"
                />
            </div>

            {/* Deskripsi */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                </label>
                <textarea
                    name="desc"
                    required
                    value={formData.desc}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 min-h-[100px] resize-none"
                    placeholder="Deskripsi singkat layanan..."
                ></textarea>
            </div>

            {/* Warna Background Icon */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Warna Background Icon
                </label>
                <select
                    name="iconBg"
                    value={formData.iconBg}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800"
                >
                    <option value="bg-[#245399]">Biru (Default)</option>
                    <option value="bg-[#EDA60E]">Kuning</option>
                </select>
            </div>

            {/* SVG Icon Code */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SVG Icon Code
                </label>
                <textarea
                    name="icon"
                    required
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all font-mono text-sm text-gray-600 min-h-[120px]"
                    placeholder="<svg...>...</svg>"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                    Tempelkan kode SVG di sini. Pastikan tidak ada class fixed width/height agar responsif.
                </p>
            </div>

            {/* Icon Preview */}
            <div className="p-4 border rounded-lg bg-gray-50 w-full flex items-center justify-center gap-4">
                <span className="text-sm text-gray-500">Preview:</span>
                <div
                    className={`w-14 h-14 ${formData.iconBg} rounded-2xl flex items-center justify-center shadow-md`}
                >
                    {formData.icon ? (
                        <div
                            className="w-6 h-6 text-white"
                            dangerouslySetInnerHTML={{ __html: formData.icon }}
                        />
                    ) : (
                        <span className="text-white text-xs">No Icon</span>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1E4278] text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save size={16} /> {loading ? "Menyimpan..." : "Simpan Layanan"}
                </button>
            </div>
        </form>
    );
}
