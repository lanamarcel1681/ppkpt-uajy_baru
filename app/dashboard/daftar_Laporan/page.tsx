"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FilterBar from "@/components/daftar_laporan/filterbar";
import LaporanTable from "@/components/daftar_laporan/laporanTable";
import DashboardLayout from "@/components/dashboard/dashboardLayout";

export default function DaftarLaporanPage() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "Semua",
    prioritas: "Semua",
    sortBy: "terlama",
  });

  // Handler untuk perubahan filter
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Handler untuk pencarian
  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const router = useRouter();

  // Handler untuk view laporan
  const handleViewLaporan = (id: string) => {
    router.push(`/dashboard/daftar_Laporan/${id}`);
  };

  // Handler untuk edit laporan
  const handleEditLaporan = (id: string) => {
    console.log("Edit laporan:", id);
    // Implementasi edit laporan
  };

  // Handler untuk delete laporan
  const handleDeleteLaporan = (id: string) => {
    console.log("Delete laporan:", id);
    // Implementasi delete laporan
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daftar Laporan</h1>
            <p className="text-gray-600 mt-1">
              Kelola dan pantau semua laporan kekerasan
            </p>
          </div>
        </div>

        <div className="border-b border-gray-200"></div>

        {/* Filter Bar */}
        <FilterBar
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Laporan Table */}
        <LaporanTable
          filters={filters}
          onViewLaporan={handleViewLaporan}
          onEditLaporan={handleEditLaporan}
          onDeleteLaporan={handleDeleteLaporan}
        />
      </div>
    </DashboardLayout>
  );
}
