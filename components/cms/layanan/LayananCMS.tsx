import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, AlertCircle, Save } from "lucide-react";
import LayananForm from "./LayananForm";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

interface LayananItem {
    id: number;
    title: string;
    desc: string;
    iconBg: string;
    icon: string;
}

export default function LayananCMS() {
    const [layananList, setLayananList] = useState<LayananItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LayananItem | null>(null);

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
        fetchLayanan();
    }, []);

    const fetchLayanan = async () => {
        setLoading(true);
        try {
            setError(null);
            const res = await fetch("/api/cms/layanan");
            const data = await res.json();
            if (Array.isArray(data)) {
                setLayananList(data);
            } else {
                console.error("API returned non-array data:", data);
                setLayananList([]);
                setError(data.error || "Gagal memuat data layanan. Pastikan server database berjalan.");
            }
        } catch (error) {
            console.error("Error fetching layanan:", error);
            setError("Terjadi kesalahan jaringan.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: any) => {
        setLoading(true);
        try {
            const url = editingItem
                ? `/api/cms/layanan/${editingItem.id}`
                : "/api/cms/layanan";
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                await fetchLayanan();
                setIsFormOpen(false);
                setEditingItem(null);
                toast.success("Berhasil menyimpan data");
            } else {
                toast.error("Gagal menyimpan data");
            }
        } catch (error) {
            console.error("Error saving layanan:", error);
            toast.error("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const executeDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/cms/layanan/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchLayanan();
                toast.success("Data layanan berhasil dihapus");
            } else {
                toast.error("Gagal menghapus data");
            }
        } catch (error) {
            console.error("Error deleting layanan:", error);
            toast.error("Terjadi kesalahan saat menghapus data");
        }
    };

    const handleDelete = (id: number) => {
        setConfirmState({
            isOpen: true,
            title: "Hapus Layanan",
            message: "Apakah Anda yakin ingin menghapus layanan ini?",
            onConfirm: () => executeDelete(id),
        });
    };

    if (isFormOpen) {
        return (
            <LayananForm
                initialData={editingItem}
                onSave={handleSave}
                onCancel={() => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                }}
                loading={loading}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Daftar Layanan</h3>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm"
                    >
                        <Plus size={18} /> Tambah Layanan
                    </button>
                    <button
                        onClick={() => toast("Fitur simpan global belum diimplementasikan", { icon: "ℹ️" })}
                        className="flex items-center gap-2 px-6 py-2 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm text-sm"
                    >
                        <Save size={18} /> Simpan
                    </button>
                </div>
            </div>

            {loading && layananList.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Memuat data...</p>
            ) : error ? (
                <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="mx-auto text-red-400 mb-2" size={32} />
                    <p className="text-red-700 font-medium">{error}</p>
                    <p className="text-red-500 text-sm mt-1">Coba restart server (npm run dev) jika baru saja menambahkan database model.</p>
                </div>
            ) : layananList.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-500">Belum ada data layanan</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {layananList.map((item) => (
                        <div
                            key={item.id}
                            className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow relative group"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
                                >
                                    <div
                                        className="w-6 h-6 text-white"
                                        dangerouslySetInnerHTML={{ __html: item.icon }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-2">{item.desc}</p>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 flex gap-2 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => {
                                    setEditingItem(item);
                                    setIsFormOpen(true);
                                }}
                                    className="p-1.5 text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg hover:bg-blue-100"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(item.id)}
                                    className="p-1.5 text-red-600 hover:text-red-600 hover:bg-red-50 rounded-lg hover:bg-red-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
            />
        </div>
    );
}
