import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, X, Save, Eye } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

interface Berita {
  id: number;
  judul: string;
  kategori: string;
  penulis: string;
  createdAt: string;
  konten: string;
  excerpt: string;
  gambarUrl: string | null;
  dokumentasi1: string | null;
  dokumentasi2: string | null;
}

interface KategoriBerita {
  id: number;
  nama: string;
}

export default function CMSBeritaConfig() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Berita",
    konten: "",
    excerpt: "",
    penulis: "Admin",
    gambarUrl: "",
    dokumentasi1: "",
    dokumentasi2: "",
  });

  // Kategori State
  const [activeTab, setActiveTab] = useState("berita");
  const [kategoriList, setKategoriList] = useState<KategoriBerita[]>([]);
  const [isModalKategoriOpen, setIsModalKategoriOpen] = useState(false);
  const [editingKategoriId, setEditingKategoriId] = useState<number | null>(null);
  const [formKategori, setFormKategori] = useState({ nama: "" });

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

  useEffect(() => {
    fetchBerita();
    fetchKategori();
  }, []);

  const fetchBerita = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/berita");
      if (res.ok) {
        const data = await res.json();
        setBeritaList(data);
      }
    } catch (error) {
      console.error("Gagal memuat berita:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const res = await fetch("/api/cms/kategori-berita");
      if (res.ok) {
        const data = await res.json();
        setKategoriList(data);

        // Auto-seed if empty (Optional, but helpful)
        if (data.length === 0) {
          // We can leave it empty or prompt user. 
          // For now, let's just leave it empty to respect "dynamic" nature.
        }
      }
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  };

  // --- Kategori Handlers ---
  const openModalKategori = (kategori?: KategoriBerita) => {
    if (kategori) {
      setEditingKategoriId(kategori.id);
      setFormKategori({ nama: kategori.nama });
    } else {
      setEditingKategoriId(null);
      setFormKategori({ nama: "" });
    }
    setIsModalKategoriOpen(true);
  };

  const closeModalKategori = () => {
    setIsModalKategoriOpen(false);
    setFormKategori({ nama: "" });
    setEditingKategoriId(null);
  };

  const saveKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKategori.nama) return;

    try {
      const url = "/api/cms/kategori-berita";
      const method = editingKategoriId ? "PUT" : "POST";
      const body = editingKategoriId
        ? { id: editingKategoriId, nama: formKategori.nama }
        : { nama: formKategori.nama };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchKategori();
        closeModalKategori();
        toast.success("Berhasil menyimpan kategori");
      } else {
        const err = await res.json();
        toast.error(err.error || "Gagal menyimpan kategori");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    }
  };

  const executeDeleteKategori = async (id: number) => {
    try {
      await fetch(`/api/cms/kategori-berita?id=${id}`, { method: "DELETE" });
      fetchKategori();
      toast.success("Kategori berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus");
    }
  };

  const deleteKategori = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Hapus Kategori",
      message: "Hapus kategori ini? Berita dengan kategori ini tidak akan hilang, tapi nama kategorinya mungkin perlu disesuaikan manual.",
      onConfirm: () => executeDeleteKategori(id),
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      judul: "",
      kategori: "Berita",
      konten: "",
      excerpt: "",
      penulis: "Admin",
      gambarUrl: "",
      dokumentasi1: "",
      dokumentasi2: "",
    });
    setEditingId(null);
  };

  const openModal = (berita?: Berita) => {
    if (berita) {
      setEditingId(berita.id);
      setFormData({
        judul: berita.judul,
        kategori: berita.kategori,
        konten: berita.konten,
        excerpt: berita.excerpt,
        penulis: berita.penulis,
        gambarUrl: berita.gambarUrl || "",
        dokumentasi1: berita.dokumentasi1 || "",
        dokumentasi2: berita.dokumentasi2 || "",
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gambarUrl) {
      toast.error("Gambar Header wajib diisi!");
      return;
    }

    const minWords = 200;
    const wordCount = formData.konten.split(" ").length;
    if (wordCount < minWords) {
      toast.error(`⚠️ Konten berita terlalu pendek!\n\nHarus memiliki minimal ${minWords} kata.`);
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `/api/cms/berita/${editingId}`
        : "/api/cms/berita";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchBerita();
        closeModal();
        toast.success("Berhasil menyimpan berita");
      } else {
        toast.error("Gagal menyimpan berita");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const executeDeleteBerita = async (id: number) => {
    try {
      const res = await fetch(`/api/cms/berita/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBerita();
        toast.success("Berita berhasil dihapus");
      } else {
        toast.error("Gagal menghapus berita");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    }
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Hapus Berita",
      message: "Apakah Anda yakin ingin menghapus berita ini?",
      onConfirm: () => executeDeleteBerita(id),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("⚠️ Ukuran file terlalu besar. Maksimal 2MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("⚠️ Format file tidak didukung. Hanya gambar JPEG, PNG, dan JPG yang diterima.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, [fieldName]: data.url }));
        toast.success("Berhasil mengupload gambar");
      } else {
        toast.error("⚠️ Gagal mengupload gambar");
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Terjadi kesalahan saat upload");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: "" }));
  };

  return (
    <div className="space-y-6">

      {/* TABS HEADER */}
      <div className="flex border-b border-gray-100 bg-white rounded-t-2xl px-8 pt-6">
        <button
          onClick={() => setActiveTab("berita")}
          className={`pb-4 px-4 font-semibold text-sm transition ${activeTab === "berita"
            ? "text-[#1E4278] border-b-2 border-[#1E4278]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Daftar Berita
        </button>
        <button
          onClick={() => setActiveTab("kategori")}
          className={`pb-4 px-4 font-semibold text-sm transition ${activeTab === "kategori"
            ? "text-[#1E4278] border-b-2 border-[#1E4278]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Kategori Berita
        </button>
      </div>

      {
        activeTab === "berita" ? (
          <div className="p-8 bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-[#1E4278]">Daftar Berita</h2>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E4278] text-white rounded-lg hover:bg-blue-800 transition shadow-sm"
              >
                <Plus size={18} /> Tambah Berita
              </button>
            </div>

            {/* LOADING STATE */}
            {loading && !isModalOpen && (
              <div className="text-center py-10 text-gray-500">
                Memuat berita...
              </div>
            )}

            {/* TABLE */}
            {!loading && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                        Judul
                      </th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                        Kategori
                      </th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                        Penulis
                      </th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                        Tanggal
                      </th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600 text-right">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {beritaList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Belum ada berita.
                        </td>
                      </tr>
                    ) : (
                      beritaList.map((berita) => (
                        <tr
                          key={berita.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-4 text-gray-800 font-medium">
                            {berita.judul}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-blue-50 text-[#1E4278] text-xs font-bold rounded-full">
                              {berita.kategori}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {berita.penulis}
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {new Date(berita.createdAt).toLocaleDateString("id-ID")}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openModal(berita)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(berita.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-[#1E4278]">Kelola Kategori Berita</h2>
              <button
                onClick={() => openModalKategori()}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E4278] text-white rounded-lg hover:bg-blue-800 transition shadow-sm"
              >
                <Plus size={18} /> Tambah Kategori
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kategoriList.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  Belum ada kategori. Silakan tambah kategori baru.
                </div>
              ) : (
                kategoriList.map(item => (
                  <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition">
                    <span className="font-semibold text-gray-800">{item.nama}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModalKategori(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteKategori(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      }

      {/* MODAL FORM */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-[#1E4278]">
                  {editingId ? "Edit Berita" : "Tambah Berita Baru"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Judul */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Berita
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 placeholder:text-gray-500"
                    placeholder="Masukkan judul berita..."
                  />
                </div>

                {/* Kategori & Penulis */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 placeholder:text-gray-500"
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoriList.map((k) => (
                        <option key={k.id} value={k.nama}>{k.nama}</option>
                      ))}
                      {/* Fallback if list is empty or for specific cases */}
                      {kategoriList.length === 0 && (
                        <option value="Umum">Umum (Default)</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Penulis
                    </label>
                    <input
                      type="text"
                      name="penulis"
                      value={formData.penulis}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* URL Gambar (Upload) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gambar Header (Wajib)
                  </label>

                  {!formData.gambarUrl ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "gambarUrl")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <div className="p-3 bg-blue-50 text-[#1E4278] rounded-full">
                          <Plus size={24} />
                        </div>
                        <p className="text-sm font-medium">
                          Klik untuk upload gambar
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, JPEG (Max. 2MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.gambarUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("gambarUrl")}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Foto Dokumentasi Loop (Optional) */}
                <div className="grid grid-cols-2 gap-6">
                  {["dokumentasi1", "dokumentasi2"].map((field, index) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Foto Dokumentasi {index + 1} (Opsional)
                      </label>

                      {!formData[field as keyof typeof formData] ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative h-40 flex flex-col justify-center items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, field)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center gap-1 text-gray-500">
                            <div className="p-2 bg-gray-100 text-gray-500 rounded-full">
                              <Plus size={20} />
                            </div>
                            <p className="text-xs font-medium">
                              Upload Foto {index + 1}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 h-40">
                          <img
                            src={formData[field as keyof typeof formData] as string}
                            alt={`Dokumentasi ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(field)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ringkasan (Excerpt)
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 placeholder:text-gray-500 resize-none"
                    placeholder="Ringkasan singkat untuk tampilan kartu..."
                  ></textarea>
                </div>

                {/* Konten */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konten Lengkap
                  </label>
                  <textarea
                    name="konten"
                    value={formData.konten}
                    onChange={handleInputChange}
                    required
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900 placeholder:text-gray-500"
                    placeholder="Tulis konten berita di sini..."
                  ></textarea>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition shadow-sm"
                  >
                    <Save size={18} /> Simpan Berita
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      {/* MODAL KATEGORI */}
      {
        isModalKategoriOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[#1E4278]">
                  {editingKategoriId ? "Edit Kategori" : "Tambah Kategori"}
                </h3>
                <button
                  onClick={closeModalKategori}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={saveKategori} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kategori</label>
                  <input
                    type="text"
                    value={formKategori.nama}
                    onChange={(e) => setFormKategori({ nama: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-900"
                    placeholder="Contoh: Kegiatan"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModalKategori}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
      />
    </div >
  );
}
