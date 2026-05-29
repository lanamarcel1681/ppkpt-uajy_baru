"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Upload,
  Save,
  Edit,
  X,
  User,
  Star,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

// Tipe Data
interface Profil {
  deskripsi_profil: string;
  visi: string;
  misi: string;
}

interface AnggotaTim {
  id: number;
  nama: string;
  jabatan: string;
  fotoUrl: string;
  pengurus?: {
    nama_pengurus: string;
    role: {
      nama_role: string;
    };
  } | null;
}

// Added Pengurus Interface
interface Pengurus {
  id_pengurus: number;
  nama_pengurus: string;
  role: {
    nama_role: string;
  };
}

export default function CMSTentangConfig() {
  const [activeTab, setActiveTab] = useState("profil");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Data States
  const [profil, setProfil] = useState<Profil>({
    deskripsi_profil: "",
    visi: "",
    misi: "",
  });

  const [timList, setTimList] = useState<AnggotaTim[]>([]);
  const [pengurusList, setPengurusList] = useState<Pengurus[]>([]); // State for Pengurus

  // Modal States
  const [isModalTimOpen, setIsModalTimOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form States for Modals
  const [formTim, setFormTim] = useState({
    nama: "",
    jabatan: "",
    fotoUrl: "",
  });

  // Selected Pengurus ID for dropdown logic
  const [selectedPengurusId, setSelectedPengurusId] = useState<number | "">("");

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

  // Fetch Data on Load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Profil
      const resProfil = await fetch("/api/cms/tentang/profil");
      const dataProfil = await resProfil.json();
      if (dataProfil) setProfil(dataProfil);

      // Fetch Tim
      const resTim = await fetch("/api/cms/tentang/tim");
      const dataTim = await resTim.json();
      setTimList(dataTim || []);

      // Fetch Pengurus List for Dropdown
      const resPengurus = await fetch("/api/pengurus");
      const dataPengurus = await resPengurus.json();
      setPengurusList(dataPengurus || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Profile Handlers ---
  const handleProfileChange = (field: string, value: string) => {
    setProfil((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/cms/tentang/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profil),
      });
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error saving profil:", error);
      toast.error("Gagal menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Tim Handlers (Modal) ---
  const openModalTim = (item?: AnggotaTim) => {
    if (item) {
      setEditingId(item.id);
      setFormTim({
        nama: item.nama,
        jabatan: item.jabatan,
        fotoUrl: item.fotoUrl || "",
      });
      // Try to find matching pengurus to set select box (optional, might not match exactly if name changed)
      const match = pengurusList.find((p) => p.nama_pengurus === item.nama);
      setSelectedPengurusId(match ? match.id_pengurus : "");
    } else {
      setEditingId(null);
      setFormTim({ nama: "", jabatan: "", fotoUrl: "" });
      setSelectedPengurusId("");
    }
    setIsModalTimOpen(true);
  };

  const closeModalTim = () => {
    setIsModalTimOpen(false);
    setEditingId(null);
  };

  // Handle Pengurus Selection
  const handlePengurusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedPengurusId(id);

    if (id) {
      const selected = pengurusList.find((p) => p.id_pengurus === id);
      if (selected) {
        setFormTim((prev) => ({
          ...prev,
          nama: selected.nama_pengurus,
          jabatan: selected.role.nama_role,
        }));
      }
    } else {
      // Optionally reset fields or keep them
    }
  };

  const handleTimImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFormTim((prev) => ({ ...prev, fotoUrl: data.url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Gagal upload gambar");
    }
  };

  const saveTim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? { id: editingId, ...formTim, id_pengurus: selectedPengurusId || null }
      : { ...formTim, id_pengurus: selectedPengurusId || null };

    try {
      const res = await fetch("/api/cms/tentang/tim", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchData();
        closeModalTim();
        toast.success("Berhasil menyimpan anggota tim!");
      } else {
        toast.error("Gagal menyimpan anggota tim");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  const executeDeleteTim = async (id: number) => {
    try {
      await fetch(`/api/cms/tentang/tim?id=${id}`, { method: "DELETE" });
      fetchData();
      toast.success("Berhasil menghapus anggota tim!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus");
    }
  };

  const deleteTim = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Hapus Anggota Tim",
      message: "Apakah Anda yakin ingin menghapus anggota ini?",
      onConfirm: () => executeDeleteTim(id),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b pb-2">
        {["profil", "tim"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${activeTab === tab
              ? "text-[#1E4278] border-b-2 border-[#1E4278]"
              : "text-gray-500 hover:text-gray-800"
              }`}
          >
            {tab === "tim" ? "Tim Satgas" : "Profil Satgas"}
          </button>
        ))}
      </div>

      {/* --- PROFIL SECTION --- */}
      {activeTab === "profil" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#1E4278]">Edit Profil</h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Singkat
            </label>
            <textarea
              value={profil.deskripsi_profil}
              onChange={(e) =>
                handleProfileChange("deskripsi_profil", e.target.value)
              }
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 placeholder:text-gray-500"
              placeholder="Deskripsi tentang satgas..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Visi
              </label>
              <textarea
                value={profil.visi}
                onChange={(e) => handleProfileChange("visi", e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 placeholder:text-gray-500"
                placeholder="Visi satgas..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Misi
              </label>
              <textarea
                value={profil.misi}
                onChange={(e) => handleProfileChange("misi", e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 placeholder:text-gray-500"
                placeholder="Misi satgas..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-gray-100 mt-8">
            <button
              onClick={saveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E4278] text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition"
            >
              <Save size={18} />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      )}

      {/* --- TIM SECTION --- */}
      {activeTab === "tim" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#1E4278]">
              Daftar Anggota Tim
            </h2>
            <button
              onClick={() => openModalTim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#1E4278] text-white rounded-lg hover:bg-blue-800 transition"
            >
              <Plus size={18} /> Tambah Anggota
            </button>
          </div>

          <div className="p-6">
            {timList.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                Belum ada anggota tim yang ditambahkan.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {timList.map((member) => {
                  const displayName =
                    member.pengurus?.nama_pengurus || member.nama;
                  const displayRole =
                    member.pengurus?.role?.nama_role || member.jabatan;

                  return (
                    <div
                      key={member.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
                    >
                      <div className="aspect-[3/4] relative bg-gray-100">
                        {member.fotoUrl ? (
                          <Image
                            src={member.fotoUrl}
                            alt={displayName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={48} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {displayName}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm mb-4">
                          {displayRole}
                        </p>

                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => openModalTim(member)}
                            className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTim(member.id)}
                            className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL TIM --- */}
      {isModalTimOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-[#1E4278]">
                {editingId ? "Edit Anggota" : "Tambah Anggota Tim"}
              </h3>
              <button
                onClick={closeModalTim}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={saveTim} className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-40 aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border-4 border-white shadow-sm">
                  {formTim.fotoUrl ? (
                    <Image
                      src={formTim.fotoUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTimImageUpload}
                    id="photo-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <Upload size={16} /> Upload Foto
                  </label>
                  <p className="text-xs text-gray-400 mt-1.5 text-center">
                    Resolusi disarankan: 600 × 800 piksel (rasio 3:4)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <select
                    value={selectedPengurusId} // Use ID for value to easily find relation
                    onChange={handlePengurusSelect}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 appearance-none"
                  >
                    <option value="">-- Pilih Anggota dari Database --</option>
                    {pengurusList.map((p) => (
                      <option key={p.id_pengurus} value={p.id_pengurus}>
                        {p.nama_pengurus}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <User size={18} />
                  </div>
                </div>
                <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold">
                    i
                  </div>
                  Data diambil dari halaman Kelola Pengurus.
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jabatan
                </label>
                <input
                  type="text"
                  value={formTim.jabatan}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none text-gray-500 cursor-not-allowed"
                  placeholder="Jabatan akan terisi otomatis..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModalTim}
                  className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
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
