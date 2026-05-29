
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import { Router, Plus, University } from "lucide-react";
import FakultasCard from "@/components/dashboard/fakultas_prodi/FakultasCard";
import FakultasForm from "@/components/dashboard/fakultas_prodi/FakultasForm";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { toast } from "react-hot-toast";
export type Prodi = {
    id: number;
    nama: string;
    id_fakultas: number;
};

export type Fakultas = {
    id: number;
    nama: string;
    prodi: Prodi[];
};

export default function KelolaFakultasProdiPage() {
    const [fakultasList, setFakultasList] = useState<Fakultas[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFakultasModalOpen, setIsFakultasModalOpen] = useState(false);
    const [editingFakultas, setEditingFakultas] = useState<Fakultas | null>(null);

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
        setLoading(true);
        try {
            const res = await fetch("/api/cms/fakultas");
            const data = await res.json();
            if (Array.isArray(data)) {
                setFakultasList(data);
            }
        } catch (error) {
            console.error("Failed to fetch fakultas", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddFakultas = () => {
        setEditingFakultas(null);
        setIsFakultasModalOpen(true);
    };

    const handleEditFakultas = (fakultas: Fakultas) => {
        setEditingFakultas(fakultas);
        setIsFakultasModalOpen(true);
    };

    const executeDeleteFakultas = async (id: number) => {
        try {
            const res = await fetch(`/api/cms/fakultas/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
            } else {
                toast.error("Gagal menghapus fakultas");
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan");
        }
    };

    const handleDeleteFakultas = (id: number) => {
        setConfirmState({
            isOpen: true,
            title: "Hapus Fakultas",
            message: "Menghapus fakultas akan menghapus semua prodi di dalamnya. Lanjutkan?",
            onConfirm: () => executeDeleteFakultas(id),
        });
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E4278] font-eras flex items-center gap-3">
                            <University className="text-[#EDA60E]" size={28} />
                            Kelola Fakultas & Program Studi
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manajemen Data Fakultas dan Program Studi Universitas
                        </p>
                    </div>
                    <button
                        onClick={handleAddFakultas}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1E4278] text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/10 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        Tambah Fakultas
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {fakultasList.map((fakultas) => (
                            <FakultasCard
                                key={fakultas.id}
                                fakultas={fakultas}
                                onEdit={() => handleEditFakultas(fakultas)}
                                onDelete={() => handleDeleteFakultas(fakultas.id)}
                                refreshData={fetchData}
                            />
                        ))}
                        {fakultasList.length === 0 && (
                            <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
                                <Router className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                Belum ada data fakultas
                            </div>
                        )}
                    </div>
                )}

                {/* Modal Form Fakultas */}
                <FakultasForm
                    isOpen={isFakultasModalOpen}
                    onClose={() => setIsFakultasModalOpen(false)}
                    onSave={fetchData}
                    editData={editingFakultas}
                />

                <ConfirmationModal
                    isOpen={confirmState.isOpen}
                    onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmState.onConfirm}
                    title={confirmState.title}
                    message={confirmState.message}
                />
            </div>
        </DashboardLayout>
    );
}
