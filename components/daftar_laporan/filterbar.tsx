"use client";

import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

// Tipe data untuk props FilterBar
interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
  onSearch?: (searchTerm: string) => void;
}

interface FilterState {
  searchTerm: string;
  status: string;
  prioritas: string;
  sortBy: string;
}

export default function FilterBar({
  onFilterChange,
  onSearch,
}: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    status: "Semua",
    prioritas: "Semua",
    sortBy: "terlama",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Handler untuk perubahan input
  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (key === "searchTerm" && onSearch) {
      onSearch(value);
    }

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Handler untuk reset filter
  const handleReset = () => {
    const resetFilters = {
      searchTerm: "",
      status: "Semua",
      prioritas: "Semua",
      sortBy: "terlama",
    };
    setFilters(resetFilters);
    setShowFilters(false);

    if (onFilterChange) {
      onFilterChange(resetFilters);
    }

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Pencarian */}
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari laporan berdasarkan ID, jenis kekerasan, atau pelapor..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.searchTerm}
              onChange={(e) => handleChange("searchTerm", e.target.value)}
            />
          </div>
        </div>

        {/* Tombol Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} color="black" />
            <span className="text-black">Filter</span>
            <ChevronDown
              size={16}
              color="black"
              className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-3 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filter Expanded */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-t border-gray-200">
          {/* Filter Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Laporan
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg text-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Direview">Direview</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          {/* Filter Prioritas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioritas
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.prioritas}
              onChange={(e) => handleChange("prioritas", e.target.value)}
            >
              <option value="Semua">Semua Prioritas</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutkan Berdasarkan
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sortBy}
              onChange={(e) => handleChange("sortBy", e.target.value)}
            >
              <option value="terlama">Tanggal Terlama</option>
              <option value="terbaru">Tanggal Terbaru</option>
              <option value="prioritas">Prioritas (Tinggi ke Rendah)</option>
              <option value="id">ID Laporan</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
