"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import toast from "react-hot-toast";
import { Plus, Tag } from "lucide-react";
import RoleList from "@/components/dashboard/roles/RoleList";
import RoleForm from "@/components/dashboard/roles/RoleForm";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function KelolaRolePage() {
  const [roleList, setRoleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

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
      const res = await fetch("/api/roles");
      const data = await res.json();
      setRoleList(data);
    } catch (error) {
      console.error("Failed to fetch roles", error);
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

  const handleEdit = (role: any) => {
    setEditingData(role);
    setIsModalOpen(true);
  };

  const executeDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/roles?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        fetchData();
      } else {
        toast.error(data.message || "Gagal menghapus role");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    }
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Hapus Role",
      message: "Apakah Anda yakin ingin menghapus role ini?",
      onConfirm: () => executeDelete(id),
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E4278] font-eras flex items-center gap-3">
              <Tag className="text-[#EDA60E]" size={28} />
              Kelola Role
            </h1>
            <p className="text-gray-500 mt-1">
              Manajemen Role pengguna (Hak Akses)
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-[#1E4278] text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/10 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Tambah Role
          </button>
        </div>

        {/* Content */}
        <RoleList
          data={roleList}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal Form */}
        <RoleForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchData}
          editData={editingData}
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
