"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import { Plus, Users } from "lucide-react";
import PengurusList from "@/components/dashboard/pengurus/PengurusList";
import PengurusForm from "@/components/dashboard/pengurus/PengurusForm";
import PengurusFilter from "@/components/dashboard/pengurus/PengurusFilter";

export default function KelolaPengurusPage() {
  const [pengurusList, setPengurusList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  // Filter States Combined
  const [filterState, setFilterState] = useState({
    searchTerm: "",
    role: "",
    fakultas: "",
    prodi: "",
    status: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pengurus");
      const data = await res.json();
      setPengurusList(data);
    } catch (error) {
      console.error("Failed to fetch pengurus", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Extract Unique Values for Dropdowns
  const roles = [...new Set(pengurusList.map((item) => item.role.nama_role))];
  const fakultas = [
    ...new Set(pengurusList.map((item) => item.fakultas).filter(Boolean)),
  ];
  const prodis = [
    ...new Set(pengurusList.map((item) => item.prodi).filter(Boolean)),
  ];

  // Filter Logic
  const filteredData = pengurusList.filter((item) => {
    const term = filterState.searchTerm.toLowerCase();
    const matchSearch =
      item.nama_pengurus.toLowerCase().includes(term) ||
      item.email_pengurus.toLowerCase().includes(term);

    const matchRole = filterState.role
      ? item.role.nama_role === filterState.role
      : true;
    const matchFakultas = filterState.fakultas
      ? item.fakultas === filterState.fakultas
      : true;
    const matchProdi = filterState.prodi
      ? item.prodi === filterState.prodi
      : true;
    const matchStatus = filterState.status
      ? String(item.is_aktif) === filterState.status
      : true;

    return (
      matchSearch && matchRole && matchFakultas && matchProdi && matchStatus
    );
  });

  const handleAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pengurus: any) => {
    setEditingData(pengurus);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E4278] font-eras flex items-center gap-3">
              <Users className="text-[#EDA60E]" size={28} />
              Kelola Pengurus
            </h1>
            <p className="text-gray-500 mt-1">
              Manajemen akun Administrator dan Tim Satgas
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-[#1E4278] text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/10 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Tambah Pengurus
          </button>
        </div>

        {/* Advanced Filter Component */}
        <PengurusFilter
          roles={roles}
          fakultas={fakultas}
          prodis={prodis}
          onFilterChange={setFilterState}
        />

        {/* Content */}
        <PengurusList
          data={filteredData}
          loading={loading}
          onEdit={handleEdit}
        />

        {/* Modal Form */}
        <PengurusForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchData}
          editData={editingData}
        />
      </div>
    </DashboardLayout>
  );
}
