import React, { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import KekerasanCard from "./KekerasanCard";
import KekerasanModal from "./KekerasanModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

interface Contoh {
    id: number;
    isi_contoh: string;
}

interface JenisKekerasan {
    id: number;
    judul: string;
    deskripsi: string;
    contoh: Contoh[];
}

export default function KekerasanCMS() {
    const [data, setData] = useState<JenisKekerasan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState<JenisKekerasan | null>(null);

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

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/cms/kekerasan");
            const jsonData = await res.json();
            if (Array.isArray(jsonData)) {
                setData(jsonData);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: JenisKekerasan) => {
        setEditingData(item);
        setIsModalOpen(true);
    };

    const executeDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/cms/kekerasan/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchData();
                toast.success("Jenis kekerasan berhasil dihapus");
            } else {
                toast.error("Gagal menghapus data");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Terjadi kesalahan saat menghapus");
        }
    };

    const handleDelete = (id: number) => {
        setConfirmState({
            isOpen: true,
            title: "Hapus Jenis Kekerasan",
            message: "Apakah Anda yakin ingin menghapus jenis kekerasan ini?",
            onConfirm: () => executeDelete(id),
        });
    };

    const handleSave = async (formData: any) => {
        try {
            const url = editingData
                ? `/api/cms/kekerasan/${editingData.id}`
                : "/api/cms/kekerasan";
            const method = editingData ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save");

            await fetchData();
            toast.success("Berhasil menyimpan data");
        } catch (error) {
            console.error("Error saving:", error);
            toast.error("Gagal menyimpan data");
            throw error;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1E4278]">
                    Edit Jenis Kekerasan
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Plus size={18} /> Tambah Jenis
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm">
                        <Save size={18} /> Simpan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item) => (
                    <KekerasanCard
                        key={item.id}
                        data={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <KekerasanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingData}
            />

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
