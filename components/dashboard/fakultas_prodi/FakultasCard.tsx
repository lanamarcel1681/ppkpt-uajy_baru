
"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import ProdiForm from "./ProdiForm";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

type Prodi = {
    id: number;
    nama: string;
    id_fakultas: number;
};

type Fakultas = {
    id: number;
    nama: string;
    prodi: Prodi[];
};

type Props = {
    fakultas: Fakultas;
    onEdit: () => void;
    onDelete: () => void;
    refreshData: () => void;
};

export default function FakultasCard({
    fakultas,
    onEdit,
    onDelete,
    refreshData,
}: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isProdiModalOpen, setIsProdiModalOpen] = useState(false);
    const [editingProdi, setEditingProdi] = useState<Prodi | null>(null);

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

    const handleAddProdi = () => {
        setEditingProdi(null);
        setIsProdiModalOpen(true);
    };

    const handleEditProdi = (prodi: Prodi) => {
        setEditingProdi(prodi);
        setIsProdiModalOpen(true);
    };

    const executeDeleteProdi = async (id: number) => {
        try {
            const res = await fetch(`/api/cms/prodi/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Program studi berhasil dihapus");
                refreshData();
            } else {
                toast.error("Gagal menghapus program studi");
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan");
        }
    };

    const handleDeleteProdi = (id: number) => {
        setConfirmState({
            isOpen: true,
            title: "Hapus Program Studi",
            message: "Hapus program studi ini?",
            onConfirm: () => executeDeleteProdi(id),
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
            {/* Header Fakultas */}
            <div className="p-5 flex items-center justify-between bg-white relative">
                <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="bg-blue-50 p-2 rounded-lg">
                        {isExpanded ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-blue-600" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{fakultas.nama}</h3>
                        <p className="text-sm text-gray-500">
                            {fakultas.prodi ? fakultas.prodi.length : 0} Program Studi
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAddProdi}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                        title="Tambah Prodi"
                    >
                        <Plus size={18} />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
                        title="Edit Fakultas"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                        title="Hapus Fakultas"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* List Prodi (Expandable) */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-2">
                    {fakultas.prodi && fakultas.prodi.length > 0 ? (
                        fakultas.prodi.map((prodi) => (
                            <div
                                key={prodi.id}
                                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg group"
                            >
                                <span className="text-gray-700 font-medium pl-2 border-l-4 border-blue-400">
                                    {prodi.nama}
                                </span>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition text-sm">
                                    <button
                                        onClick={() => handleEditProdi(prodi)}
                                        className="text-amber-600 hover:text-amber-800 font-medium px-2 py-1"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProdi(prodi.id)}
                                        className="text-red-600 hover:text-red-800 font-medium px-2 py-1"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-2 text-sm italic">
                            Belum ada program studi. Klik (+) untuk menambahkan.
                        </p>
                    )}
                </div>
            )}

            {/* Modal Prodi */}
            <ProdiForm
                isOpen={isProdiModalOpen}
                onClose={() => setIsProdiModalOpen(false)}
                onSave={refreshData}
                id_fakultas={fakultas.id}
                editData={editingProdi}
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
