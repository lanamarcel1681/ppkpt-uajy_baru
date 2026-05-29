"use client";

import { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  AlertCircle,
  Check,
  Loader2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

type Candidate = {
  id_pengurus: number;
  nama_pengurus: string;
  fakultas: string;
  prodi: string;
  role_nama: string;
  activeReportsCount?: number;
};

type AssignTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  onSuccess: () => void;
  initialKorbanIds?: number[];
  initialPelakuIds?: number[];
};

export default function AssignTeamModal({
  isOpen,
  onClose,
  reportId,
  onSuccess,
  initialKorbanIds = [],
  initialPelakuIds = [],
}: AssignTeamModalProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for selection
  const [selectedKorban, setSelectedKorban] = useState<number[]>([]);
  const [selectedPelaku, setSelectedPelaku] = useState<number[]>([]);

  // Constraints
  const MIN_MEMBERS = 3;
  const MAX_MEMBERS = 5;

  useEffect(() => {
    if (isOpen && reportId) {
      fetchCandidates();
      setSelectedKorban(initialKorbanIds);
      setSelectedPelaku(initialPelakuIds);
    }
  }, [isOpen, reportId, initialKorbanIds, initialPelakuIds]);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/satgas/candidates?reportId=${reportId}`);
      if (!res.ok) throw new Error("Gagal mengambil data kandidat");
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const addMember = (
    id: string, // from select value
    currentList: number[],
    setList: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    const numId = Number(id);
    if (!numId) return;

    // Check if already in this specific team
    if (currentList.includes(numId)) {
      toast.error("Anggota ini sudah dipilih di tim ini.");
      return;
    }

    if (currentList.length >= MAX_MEMBERS) {
      toast.error(`Maksimal ${MAX_MEMBERS} anggota tim.`);
      return;
    }

    setList([...currentList, numId]);
  };

  const removeMember = (
    id: number,
    currentList: number[],
    setList: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setList(currentList.filter((item) => item !== id));
  };

  const handleSave = async () => {
    if (
      selectedKorban.length < MIN_MEMBERS ||
      selectedPelaku.length < MIN_MEMBERS
    ) {
      toast.error(`Minimal ${MIN_MEMBERS} anggota untuk masing-masing tim.`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/assign-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          korbanTeamIds: selectedKorban,
          pelakuTeamIds: selectedPelaku,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan tim assignment");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper to filter options for dropdown based on specific list
  const getAvailableOptions = (currentList: number[]) => {
    return candidates.filter((c) => !currentList.includes(c.id_pengurus));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Assign Tim Satgas
            </h2>
            <p className="text-sm text-gray-500">
              Pilih anggota tim untuk menangani kasus ini.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* TIM KORBAN */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                    <UserPlus size={18} /> Tim Korban
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${selectedKorban.length >= MIN_MEMBERS ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                  >
                    {selectedKorban.length}/{MAX_MEMBERS} Anggota
                  </span>
                </div>

                {/* Dropdown */}
                <div className="relative">
                  <select
                    className="w-full p-3 pl-4 pr-10 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-black"
                    onChange={(e) => {
                      addMember(
                        e.target.value,
                        selectedKorban,
                        setSelectedKorban,
                      );
                      e.target.value = ""; // Reset select
                    }}
                  >
                    <option value="">+ Tambah Anggota Tim Korban...</option>
                    {getAvailableOptions(selectedKorban).map((c) => (
                      <option key={c.id_pengurus} value={c.id_pengurus}>
                        {c.nama_pengurus} ({c.prodi}){c.activeReportsCount ? ` - ${c.activeReportsCount} Tugas Aktif` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>

                {/* Selected List */}
                <div className="space-y-2">
                  {selectedKorban.map((id) => {
                    const member = candidates.find((c) => c.id_pengurus === id);
                    if (!member) return null;
                    return (
                      <div
                        key={id}
                        className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-colors group"
                      >
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {member.nama_pengurus}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.fakultas} - {member.prodi}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeMember(id, selectedKorban, setSelectedKorban)
                          }
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                  {selectedKorban.length === 0 && (
                    <p className="text-sm text-gray-400 italic text-center py-2">
                      Belum ada anggota dipilih.
                    </p>
                  )}
                </div>
              </div>

              {/* TIM PELAKU */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-red-50/50 p-2 rounded-lg border border-red-100">
                  <h3 className="font-semibold text-red-700 flex items-center gap-2">
                    <UserPlus size={18} /> Tim Pelaku
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${selectedPelaku.length >= MIN_MEMBERS ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                  >
                    {selectedPelaku.length}/{MAX_MEMBERS} Anggota
                  </span>
                </div>

                {/* Dropdown */}
                <div className="relative">
                  <select
                    className="w-full p-3 pl-4 pr-10 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-black"
                    onChange={(e) => {
                      addMember(
                        e.target.value,
                        selectedPelaku,
                        setSelectedPelaku,
                      );
                      e.target.value = "";
                    }}
                  >
                    <option value="">+ Tambah Anggota Tim Pelaku...</option>
                    {getAvailableOptions(selectedPelaku).map((c) => (
                      <option key={c.id_pengurus} value={c.id_pengurus}>
                        {c.nama_pengurus} ({c.prodi}){c.activeReportsCount ? ` - ${c.activeReportsCount} Tugas Aktif` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>

                {/* Selected List */}
                <div className="space-y-2">
                  {selectedPelaku.map((id) => {
                    const member = candidates.find((c) => c.id_pengurus === id);
                    if (!member) return null;
                    return (
                      <div
                        key={id}
                        className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-red-200 transition-colors group"
                      >
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {member.nama_pengurus}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.fakultas} - {member.prodi}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeMember(id, selectedPelaku, setSelectedPelaku)
                          }
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                  {selectedPelaku.length === 0 && (
                    <p className="text-sm text-gray-400 italic text-center py-2">
                      Belum ada anggota dipilih.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-xl shrink-0">
          <div className="text-xs text-gray-500">
            * Wajib pilih minimal {MIN_MEMBERS} orang per tim.
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={
                loading ||
                saving ||
                selectedKorban.length < MIN_MEMBERS ||
                selectedPelaku.length < MIN_MEMBERS
              }
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Simpan Penugasan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
