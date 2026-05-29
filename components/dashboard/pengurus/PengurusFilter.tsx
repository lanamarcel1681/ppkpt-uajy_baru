"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, RotateCcw } from "lucide-react";

interface FilterState {
  searchTerm: string;
  role: string;
  fakultas: string;
  prodi: string;
  status: string;
}

interface PengurusFilterProps {
  roles: string[];
  fakultas: string[];
  prodis: string[];
  onFilterChange: (filters: FilterState) => void;
}

export default function PengurusFilter({
  roles,
  fakultas,
  prodis,
  onFilterChange,
}: PengurusFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    role: "",
    fakultas: "",
    prodi: "",
    status: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Debounce notification to parent
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, onFilterChange]);

  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      searchTerm: "",
      role: "",
      fakultas: "",
      prodi: "",
      status: "",
    });
    setShowFilters(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari pengurus berdasarkan nama atau email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all"
            value={filters.searchTerm}
            onChange={(e) => handleChange("searchTerm", e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all ${
              showFilters
                ? "bg-blue-50 border-blue-200 text-[#1E4278]"
                : "border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Filter size={18} />
            <span className="font-medium">Filter</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all hover:text-red-500 hover:border-red-200"
            title="Reset Filter"
          >
            <RotateCcw size={18} />
            <span className="hidden md:inline font-medium">Reset</span>
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Role Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Role
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E4278] text-gray-700"
              value={filters.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="">Semua Role</option>
              {roles.map((role: any) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Fakultas Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Fakultas
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E4278] text-gray-700"
              value={filters.fakultas}
              onChange={(e) => handleChange("fakultas", e.target.value)}
            >
              <option value="">Semua Fakultas</option>
              {fakultas.map((fak: any) => (
                <option key={fak} value={fak}>
                  {fak}
                </option>
              ))}
            </select>
          </div>

          {/* Prodi Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Prodi
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E4278] text-gray-700"
              value={filters.prodi}
              onChange={(e) => handleChange("prodi", e.target.value)}
            >
              <option value="">Semua Prodi</option>
              {prodis.map((prodi: any) => (
                <option key={prodi} value={prodi}>
                  {prodi}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Status
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E4278] text-gray-700"
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
